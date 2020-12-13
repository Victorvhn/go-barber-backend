import ICacheProvider from '../models/ICacheProvider';

class FakeRedisCacheProvider implements ICacheProvider {
  constructor() {
    this.client = new Redis();
  }

  public async save(key: string, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async recover(key: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async invalidate(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default FakeRedisCacheProvider;
