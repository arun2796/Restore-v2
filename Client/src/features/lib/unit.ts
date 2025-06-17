export function Currency(amount:number){
    return '$' +(amount/100).toFixed(2)
}