class Observer{
    constructor() {
    }
    
    onNotify(entity, event){
    }
}

class Subject{
    constructor() {
        this.observers = [];
    }
    
    addObserver(observer){
        
    }
    
    removeObserver(observer){
        
    }
    
    notify(entity, event)
    {
        for (let i = 0; i < this.observers.length; i++)
        {
            this.observers[i].onNotify(entity, event);
        }
    }
}

//class Physics extends Subject{
//    updateEntity(entity){
//        
//    }
//}