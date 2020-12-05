import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDto from '../dtos/IParseMailTemplateDto';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ template }: IParseMailTemplateDto): Promise<string> {
    return template;
  }
}

export default FakeMailTemplateProvider;
