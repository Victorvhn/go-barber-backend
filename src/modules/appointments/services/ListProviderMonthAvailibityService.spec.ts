import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailibityService from './ListProviderMonthAvailibityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderMonthAvailibity: ListProviderMonthAvailibityService;

describe('ListProviderMonthAvailibity', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProviderMonthAvailibity = new ListProviderMonthAvailibityService(
      fakeAppointmentRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const providerId = 'user';

    await fakeAppointmentRepository.create({
      providerId,
      date: new Date(2020, 3, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      providerId,
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      providerId,
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      providerId,
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailibity.execute({
      providerId,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
      ]),
    );
  });
});
