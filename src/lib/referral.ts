export const generateReferralCode = (name: string) => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return name.substring(0, 3).toUpperCase() + random;
};