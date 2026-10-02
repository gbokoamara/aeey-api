

module.exports = {
    addFeePercent : ( amount, fee) => {
        const percent = (amount * fee) / 100 ;
        const total = amount + percent;
         return total ;
    }, 
    takeFeePercent: ( amount, fee) => {
        const percent = (amount * fee) / 100 ;
        const total = amount - percent;
         return total ;
    },  
}