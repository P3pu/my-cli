#!/usr/bin/env node
const fs = require('fs');
const path = "./bin/db.json"


// READ
// lê o arquivo json e retorna em objeto
const getTasks = () => {
    const dbfille = fs.readFileSync(path, 'utf8') // valor = retorna o arquivo json em texto
    if (!dbfille) {
        return []
    }
    const dataJson = JSON.parse(dbfille) // valor = retorna o objeto javaScript
    return dataJson
}

// vai salvar uma tarefa no arquivo json
const saveTasks = (ListTasks) => {
    fs.writeFile(path, JSON.stringify(ListTasks, null, 2), 'utf8', e => {
        if (e) {
            return e
        }
    })
}

// CREATE
const addTasks  = async (tasks) => {
    const ListTasks = getTasks() // valor =  objeto JavaScript, se arquivo estiver vazio retorna [] 
     const newList = await {
        id: newId(ListTasks),
        Tarefa: tasks,
        description: await description(), // aguarda a entrada
        progresso: "todo",
        create:createAt(),
        updateDate:createAt()

    }
    ListTasks.push(newList)
    saveTasks(ListTasks)
}

const newId = (ListTasks) => {
    if (ListTasks.length === 0) {
        return 1
    }
    const nextId = ListTasks.length + 1
    return nextId
}

const deteleTasks = (id) => {
    const ListTasks = getTasks() // valor =  objeto JavaScript, se arquivo estiver vazio retorna [] 

    const tasksIndex = ListTasks.findIndex(task => task.id === parseInt(id)) // retorna o index da tarefa
    if (tasksIndex !== -1) { // -1 é vazio
        ListTasks.splice(tasksIndex, 1)
    }
    saveTasks(ListTasks)
}


// UPDATE
const updateTasks = (id, tasks) => {
    const ListTasks = getTasks()

    const taskIndex = ListTasks.findIndex(value => value.id === parseInt(id))
    if (taskIndex !== -1) {
        ListTasks[taskIndex].Tarefa = tasks
        ListTasks[taskIndex].updateDate = createAt()
    }
    
    saveTasks(ListTasks)
}

const progressTasks = (progress, id) => {
    const ListTasks = getTasks()

    const taskIndex = ListTasks.findIndex(value => value.id === parseInt(id))
    if (taskIndex !== -1) {
        ListTasks[taskIndex].updateDate = createAt()
        if (progress === "mark-in-progress") {
            ListTasks[taskIndex].progresso = "in-progress"
        } else if (progress === "mark-done") {
            ListTasks[taskIndex].progresso = "done"
        } else {
            return;
        }
    }
    saveTasks(ListTasks)

}

const tasksList = () => {
    const ListTasks = getTasks()

    if (process.argv.slice(-1)[0] === "list") {
        ListTasks.forEach(element => {
            console.log(element)
        });
    } else if (process.argv.slice(-1)[0] === "done") {
        ListTasks.forEach(element => {
            if (element.progresso == "done") {
                console.log(element)
            }
        });
    } else if(process.argv.slice(-1)[0] === "in-progress"){
        ListTasks.forEach(element => {
            if (element.progresso == "in-progress") {
                console.log(element)
            }
        });
    }  else if(process.argv.slice(-1)[0] === "todo"){
        ListTasks.forEach(element => {
            if (element.progresso == "todo") {
                console.log(element)
            }
        });
    } else{
        return;
    }

}

const createAt = ()=>{
    const date = new Date()
    return date.toLocaleString()
}

const description = () => {
    return new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdout.write("Digite a descrição da tarefa:\n");

        process.stdin.once('data', (data) => {
            const input = data.trim();
            process.stdin.pause();
            resolve(input);
        });
    });
};

if (process.argv.includes("add")) {
    addTasks(process.argv.slice(-1)[0])
} else if (process.argv.includes('delete')) {
    deteleTasks(process.argv.slice(-1)[0])
} else if (process.argv.includes('update')) {
    updateTasks(process.argv.slice(3, -1)[0], process.argv.slice(-1)[0])
    console.log(process.argv.slice(3, -1)[0])
} else if (process.argv.slice(1)[1].substr(0, 4) === "mark") {
    progressTasks(process.argv.slice(2, -1)[0], process.argv.slice(-1)[0])
} else if (process.argv.includes('list')) {
    tasksList()
}

