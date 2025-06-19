export function Currency(amount:number){
    return '₹' +(amount/100).toFixed(2)
}

export function  FilterValueEmpty(values:object){
           return Object.fromEntries(
            Object.entries(values).filter(
                ([, values])=>values!==""&&values!==null&&values!==undefined&& values.length!==0))            
} 