export class hold {
    type: string; // determines hold type (foot, start, finish, etc)
    location: number // hold's light pin location 

    constructor(x: string, y: number){
        this.type = x;
        this.location = y;
    }
    getType(){ 
        return this.type;
    }
    getLocation(){
        return this.location;
    }
}

