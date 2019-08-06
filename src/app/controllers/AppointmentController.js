import * as Yup from 'yup';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({
        status: false,
        error: 'Validation fails.',
      });
    }

    return res.json({ ok: true });
  }
}

export default new AppointmentController();
