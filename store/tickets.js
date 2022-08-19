export const state = () => ({
    tickets: []
})

export const mutations = {
    addTicket(state, ticket){
        if (!(state.tickets.includes(ticket))) {
            state.tickets.push(ticket)
        }
    }
}
