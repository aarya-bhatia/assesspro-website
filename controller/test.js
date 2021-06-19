const getScore = async (id) => {
    return new Promise(res => {
        setTimeout(() => {
            res(id)
        }, 1000)
    })
}


const getTotal = async (list) => {
    let t = 0
    for (let i = 0; i < list.length; i++) {
        const s = await getScore(list[i])
        t += s
    }
    console.log(t)
    return t
}


(async () => await getTotal([1, 2, 3, 4, 5]))()