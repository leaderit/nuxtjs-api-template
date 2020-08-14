// Test api entry
let i = 0

async function index() {
    i = i +1
    console.log( { i } )
    return ( { status: 'ok', i } )        
}

export {
    index
}
