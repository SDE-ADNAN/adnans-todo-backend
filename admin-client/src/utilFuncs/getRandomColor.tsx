function getRandomColor(): string {
    const randomValue = () => Math.floor(Math.random() * 156) + 100; // Range: 100-255
    const r = randomValue();
    const g = randomValue();
    const b = randomValue();
    return `rgb(${r}, ${g}, ${b})`;
}

export default getRandomColor