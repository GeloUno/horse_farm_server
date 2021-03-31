export interface IErrorClassValidator {
  property: string;
  constraints: {
    isNotEmpty: string;
    isEmail: string;
  };
}
