import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { month, year } = request.query;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const appointment = await listProviderMonthAvailability.execute({
      providerId,
      month: Number(month),
      year: Number(year),
    });

    return response.json(appointment);
  }
}

export default ProviderMonthAvailabilityController;
