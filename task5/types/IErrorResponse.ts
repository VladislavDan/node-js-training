export interface IErrorResponse {
    status: string;
    errors: Array<{
        path: Array<string | number>;
        message: string;
    }>
}
