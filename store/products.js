export const state = () => ({})
export const getters = {
    getPrice: _ => (variant) => {
        if (variant.type === 'unique') {
            return variant.option.price.value
        } else {
            const prices = Array.from(new Set(variant.options.map(option => option.price.value)))
            return { min: Math.min(...prices), max: Math.max(...prices) }
        }
    }
}