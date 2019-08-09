import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // List appointments from user logged
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Validation fails.',
      });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        status: false,
        error: 'You can only create appointments with providers.',
      });
    }

    /**
     * Check if user logged is provider_id
     */
    if (req.userId === provider_id) {
      return res.status(401).json({
        status: false,
        error: 'You can not create appointments to yourself.',
      });
    }

    // Get only hours and minutes and second equal zero - date appointment
    const hourStart = startOfHour(parseISO(date));

    // Check date choosed is greater than date now
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        status: false,
        error: 'Past dates are not permitted.',
      });
    }

    /**
     * Check date availability to provider
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({
        status: false,
        error: 'Appointment date is not available.',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd 'de' MMMM', ás' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo Agendamento de ${user.name} para o dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
