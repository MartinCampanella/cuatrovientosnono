function loadGaleriaCabana1() {
    var imagenes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    var galeria = document.getElementById('galeria-cabana-1');

    for(imagen of imagenes){
        galeria.innerHTML += `  <div class="card"> 
                                            <a data-toggle="modal" data-target="#cabana-1-foto-${imagen}-modal">
                                                <img src="static/img/cabana1/${imagen}.jpg" class="card-img-top">
                                            </a>
                                        </div>

                                        <div class="modal fade" id="cabana-1-foto-${imagen}-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <button type="button" class="close mr-2" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                                                <img src="static/img/cabana1/${imagen}.jpg" class="img-fluid rounded">
                                            </div>
                                        </div>
            `
    }
}

function loadGaleriaCabana2() {
    var imagenes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    var galeria = document.getElementById('galeria-cabana-2');

    for(imagen of imagenes){
        galeria.innerHTML += `  <div class="card"> 
                                            <a data-toggle="modal" data-target="#cabana-2-foto-${imagen}-modal">
                                                <img src="static/img/cabana2/${imagen}.jpg" class="card-img-top">
                                            </a>
                                        </div>

                                        <div class="modal fade" id="cabana-2-foto-${imagen}-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <button type="button" class="close mr-2" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                                                <img src="static/img/cabana2/${imagen}.jpg" class="img-fluid rounded">
                                            </div>
                                        </div>
            `
    }
}

function loadGaleriaPredio(){
    var imagenes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
    var galeria = document.getElementById('galeria-predio');

    for(imagen of imagenes){
        galeria.innerHTML += `  <div class="card"> 
                                            <a data-toggle="modal" data-target="#predio-foto-${imagen}-modal">
                                                <img src="static/img/predio/${imagen}.jpg" class="card-img-top">
                                            </a>
                                        </div>

                                        <div class="modal fade" id="predio-foto-${imagen}-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <button type="button" class="close mr-2" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                                                <img src="static/img/predio/${imagen}.jpg" class="img-fluid rounded">
                                            </div>
                                        </div>
            `
    }
}

function loadGaleriaRio(){
    var imagenes = [1,2,3,4,5,6,7,8,9];
    var galeria = document.getElementById('galeria-rio');

    for(imagen of imagenes){
        galeria.innerHTML += `  <div class="card"> 
                                            <a data-toggle="modal" data-target="#rio-foto-${imagen}-modal">
                                                <img src="static/img/rio/${imagen}.jpg" class="card-img-top">
                                            </a>
                                        </div>

                                        <div class="modal fade" id="rio-foto-${imagen}-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <button type="button" class="close mr-2" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                                                <img src="static/img/rio/${imagen}.jpg" class="img-fluid rounded">
                                            </div>
                                        </div>
            `
    }
}

loadGaleriaCabana1()
loadGaleriaCabana2()
loadGaleriaRio()
loadGaleriaPredio()
