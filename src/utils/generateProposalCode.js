export const generateProposalCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const randomLetters = Array.from({ length: 3 })
        .map(() => letters[Math.floor(Math.random() * 26)])
        .join("");

    const randomNumbers = Math.floor(100 + Math.random() * 900);

    return `${randomLetters}${randomNumbers}`;
};
