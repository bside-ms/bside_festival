const MotorAdminResponse = (
  status: number = 200, 
  responseBody: Record<string, unknown> | null = null
): Response => {

    const isEmpty = !responseBody || Object.keys(responseBody).length === 0;

    if (isEmpty) {
        return new Response(null, {
            status: 204
        });
    }
    const responseData = JSON.stringify(responseBody);
    const contentLength = new TextEncoder().encode(responseData).length;

    return new Response(responseData, {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': contentLength.toString(), // we need to deactivate chunking
        },
    });
};

export default MotorAdminResponse;