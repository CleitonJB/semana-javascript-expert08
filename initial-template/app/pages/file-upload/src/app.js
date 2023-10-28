import Clock from './deps/clock.js';
import View from './view.js';

const view = new View();
const clock = new Clock();

const worker = new Worker('./src/worker/worker.js', {
    type: "module"
});

worker.onerror = (error) => {
    console.error(`Erro no worker: ${JSON.stringify(error)}`);
};

worker.onmessage = ({ data }) => {
    if(data.status !== 'done') return;

    clock.stop();
    view.updateElapsedTime(`Process took ${took.replace('ago', '')}`);
};

let took = '';

view.configureOnFireChange(file => {
    const canvas = view.getCanvas();

    worker.postMessage({
        file,
        canvas
    },[
        canvas
    ]);

    clock.start((time) => {
        took = time;
        view.updateElapsedTime(`Process started ${time}`);
    });
});

async function fakeFetch() {
    const filePath = '/videos/frag_bunny.mp4';

    //* Informar o tamanho do conteúdo
    // const response = await fetch(filePath, {
    //     method: "HEAD"
    // });
    // console.log("Tamanho do arquivo: ", response.headers.get('content-length'));

    const response = await fetch(filePath);

    switch(response.status) {
        case 200:
            selectFakeFile(response, filePath);
        break;

        default:
            alert(`Erro ao pré-selecionar arquivo - status: ${response.status}`);
        break;
    }
}

async function selectFakeFile(response, filePath) {
    const file = new File([await response.blob()], filePath, {
        type:         'video/mp4',
        lastModified: Date.now()
    });

    const event = new Event('change');
    Reflect.defineProperty(event, 'target', {
        value: { files: [file] },
    });

    document.getElementById('fileUpload').dispatchEvent(event);
}

fakeFetch();