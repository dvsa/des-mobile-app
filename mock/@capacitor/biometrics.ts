export const NativeBiometricMock = {
    /* eslint-disable */
    async isAvailable({ useFallback: boolean, }) {
        return Promise.resolve({ biometryType: '', isAvailable: true });
    },
    async verifyIdentity({ reason: string, useFallback: boolean, }) {
        return Promise.resolve(true);
    },
    setCredentials() {},
    deleteCredentials() {},
    /* eslint-enable */
};
