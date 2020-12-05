import IParseMailTemplateDto from '../dtos/IParseMailTemplateDto';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDto): Promise<string>;
}
