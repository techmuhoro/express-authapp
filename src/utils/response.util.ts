export function resPayload(status: boolean, data: any, errors: any = '') {
    return {
        success: status,
        data,
        errors,
    };
}
