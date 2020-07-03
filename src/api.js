export const updateBetSlip = async (name) => {
    const response = await fetch("./betslip", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ selection: name }),
    })
    const result = await response.json()
    return result
}
