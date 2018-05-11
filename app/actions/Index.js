/**
 * Created by sencha on 2017/3/23.
 */
export function addTodo(num) {
    return{
        type:'INCREMENT',
        num:num
    }
}

export function decTodo(num) {
    return{
        type:'DECREMENT',
        num:num
    }
}

export function addScale(scale) {
    return{
        type:'AddScale',
        num:scale
    }
}
export function decScale(scale) {
    return{
        type:'DecScale',
        num:scale
    }
}

export function updateText(text) {
    return{
        type:'TEXT_UPDATE',
        text:text
    }
}