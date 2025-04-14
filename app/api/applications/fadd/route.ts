const importDeviceFeatures = async (request: Request): Promise<Response> => {
    try {
        const deviceFeaturesToImport = await request.json();

        console.log('deviceFeaturesToImport', deviceFeaturesToImport);

        return Response.json(null, {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return Response.json(null, { status: 505 });
    }
};

export { importDeviceFeatures as POST };
