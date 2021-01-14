export interface ErrorClassValidator {
  property: String;
  constraints: {
    isNotEmpty: String;
    isEmail: String;
  };
}
