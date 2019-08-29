$(document).ready(function () {
  
    // Variáveis Globais
    let loading = false;
    let dataPokemon = null;

    let num_pag_max = 0;
    let pokedexImgs = [];
    let backImgsHighest = [];
    let frontImgsHighest = [];

    //controle paginação da lista de pokemoms
    let pageActual = 1;
    //limit pokemons máximo = 949
    let limitPokemons = 802;
    let limitPage = 10;

    //controle paginação dos movimentos do pokemom
    let pageMovActual = 1;
    let pokemonMovs = [];
    let limitPageMov = 10;

    //define quantidade máxima de páginas
    num_pag_max = Math.ceil(pokedexImgs.length / limitPage);
   
    //define quantidade máxima de páginas do movimentos
    num_pag_max_mov = Math.ceil(pokemonMovs.length / limitPageMov);

//===================================================================================================
    //inicializa a pokedex
    function startPokedex() {

        //cria um array com o elemento img
        // It Creates an array with the element img
        for (var i = 1; i <= limitPokemons; i++) {            
            pokedexImgs.push(`<img class="pokemon"
                     src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + i + `.png"/>`);
        }

        // It Initiates the pokedex with the first pokemons
        for (let i = limitPage - 1; i >= 0; i--) {

            $('.box-pok').prepend(`
                <div class="col col-sm-4 pok">
                    ${pokedexImgs[i]}
                </div>              
            `);

        }

        //add event of click previous
        $('.page-1').on('click', () => {
            controlePaginacao(--pageActual);
        });

        //add event of click next
        $('.page-2').on('click', () => {
            controlePaginacao(++pageActual);
        });

        //Add an event click on the  initials images
        pokemonOnClick();

        //Buttons of right side of the display 
        pokedexSideLeft();

        // It Opens the modalStatus
        pokedexStatus();

        // It Exhibits the six pokemons stronger in attack
        pokedex();

        //  It Opens the grafic of status
        openGraficoStatus();

        // It Exhibits  the movements of a pokmemon specific 
        showMovs();

        //It exhibit all the pokeBalls
        showPokeBalls();

        //Search by pokemons
        searchPoke();

        $width = $(window).width();
        // console.log($width);debugger
        sizePage($width);

        pokedexOpen($width);        
        
    }

    window.onresize=function() {
        $width = getDimensions();
        let $display = $('.cover').css('display');
        if($display === 'block'){
            sizePage($width);
        }
        pokedexOpen($width); 
    }
    // Inicializa toda a aplicação
    startPokedex();

//===================================================================================================
    //Abre a tampa da pokedex
    function pokedexOpen($width){

        $('#yellowTriangle').on('click', ()=>{
            
            if($width < 575){
                $('.cover').css('transform','rotateX(180deg) translateY(420px)');
                $('#logo').fadeOut(500);
                $('#yellowTriangle').fadeOut(500);
                $('.cover').fadeOut(900,()=>{
                    $('.side-left').fadeIn(1);
                }); 
            }else{
                $('.cover').css('transform','rotateY(180deg) translateX(-300px)');
                $('#logo').fadeOut(500);
                $('#yellowTriangle').fadeOut(500);
                $('.cover').fadeOut(900,()=>{
                    $('.sombra_container').css('box-shadow','-1vh .8vh 0vh 0.4vh rgb(158, 18, 42)');
                    $('.side-right').fadeIn(1);
                });                
            }

            return false;
        });
        // Fecha a tampa da pokedex
        pokedexClose($width); 

    }

    // Fecha a tampa da pokedex
    function pokedexClose($width){

        $('#yellowTriangleR').on('click', ()=>{
            $('.cover').attr('transition-duration','1s');
            $('.cover').show();
            if($width < 575){
                $('.cover').css('transform','rotateX(360deg) translateY(0px)');
                $('.side-left').fadeOut(1);
            }else{
                $('.cover').css('transform','rotateY(360deg) translateX(0px)');
                    $('.side-right').fadeOut(1, ()=>{
                $('.sombra_container').css('box-shadow','-1vh .8vh 0vh 0.8vh rgb(184,184,184)');  
                });
            }
            $('#logo').fadeIn(500);
            $('#yellowTriangle').fadeIn(500);

             
            sizePage($width);
            return false;
        });
        
        
    }

    function sizePage(width){
        
        if(width < 575){
            $('.side-right').fadeIn();
            $('.side-left').css('display', 'none');
        }else{
            $('.side-left').fadeIn();
            $('.side-right').css('display', 'none');
        }
    }

    // Makes the control of the pagination of pokemons and receives the current state of the page.
    function controlePaginacao(statePage) {

        if (statePage == 0) {
            statePage += 1;
            pageActual += 1;
        }

        if (statePage == 1) {
            $('.page-1').hide();
        } else {
            $('.page-1').show();
        }

        if (statePage == num_pag_max) {
            pageActual = num_pag_max;
            $('.page-2').hide();
        } else {
            $('.page-2').show();
        }

        pokedexAddPok();

    }

    function pokedexAddPok() {

        //retorna um array com paginação
         /**
         * If the array has a size 30
         * pageActual = 1
         * limitPage = 10
         * O Parametro pagina atual controla a paginação
         * The parameter pageActual control the pagination
         * pageActual return an array with 10 position 0 ---------- 9
         * pageActual = 2
         * pageActual return an array with 10 position10 ---------- 19
         */
        let pokemons = listItems(pokedexImgs, pageActual, limitPage);
            
        // remove the div with the class pok 
        $('.pok').remove();
        for (let i = 0; i <= pokemons.length - 1; i++) {

            $('.box-pok').prepend(`
                <div class="col col-sm-4 pok">
                    ${pokemons[(pokemons.length - 1) - i]}
                </div>
                
            `);

        }
        // Adds event of click on the images of the pagination
        pokemonOnClick()
    }

    // ==================================================================================================
    //Pagination return a array with (listItems is called in pokedexAddPok and pokedexAddMov)
    //  listItems return a array with pagination
    /**
     * If the array has a size 30
     * pageActual = 1
     * limitPage = 10
     * O Parametro pagina atual controla a paginação
     * The parameter pageActual control the pagination
     * pageActual return an array with 10 position 0 ---------- 9
     * pageActual = 2
     * pageActual return an array with 10 position10 ---------- 19
     */
    function listItems(items, pageActual, limitItems) {
        let result = [];
        let totalPage = Math.ceil(items.length / limitItems);
        let count = (pageActual * limitItems) - limitItems;
        let delimiter = count + limitItems;

        if (pageActual <= totalPage) {
            for (let i = count; i < delimiter; i++) {
                if (items[i] != null) {
                    result.push(items[i]);
                }
                count++;
            }
        }

        return result;
    };

    //===================================================================================================

    // if (loading) {
    //     setInterval(function () {
    //         toggleLights();
    //     }, 1000)
    // }

    //adds the events of click in the images
    function pokemonOnClick() {
        //class pokemon is added in the tag image on the start of the aplication
        $('.pokemon').on('click', function () {

            loading = true;
            var id = $(this).attr('src');
            id = id.split('/pokemon/');
            id = id[1].split('.');
            id = id[0];
            //id = id.slice(id.length-10, id.length);

            $.get("https://pokeapi.co/api/v2/pokemon/" + id + "/", function (data, status) {
                // console.log(status);
                dataPokemon = data;
                // console.log(data);
                
                if (status === "success") {
                    $('.textGreen').css('display','none');
                    $('.pokemonImg').attr('src', data.sprites.front_default);

                }


            }, "json");

        });
    }

    //===================================================================================================
    // Exhibits the pokemon of several shapes and formats
    function pokedexSideLeft(){

        $('#shiny_f').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.front_shiny); 
        });

        $('#shiny_b').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.back_shiny); 
        });
     
        $('#front').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.front_default); 
        });

        $('#back').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.back_default); 
        });
    }

//===================================================================================================
    //It opens the modalStatus
    function pokedexStatus(){
        
        $('#one').on('click',()=>{
            
            let id = 0;
            /* The pokemon's description uses the biggest value of the statistics  divided  by 5 how
             a parameter to the id of the characteristics */
            let max_inicio = 0;

            // console.log(id);
            // Verifies whether a pokemon was selected
            if(dataPokemon == null){
                // remove o src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }

            //calculo para definir a descrição do pokemon
            //Makes a calculation to define the description of the pokemon
            dataPokemon.stats.forEach(element => {
                
                if(element.base_stat > max_inicio){
                    max_inicio = element.base_stat;
                }
                
            });
            
            id =  Math.round(max_inicio/5);


            $('#stats').prepend(`
                <div class="sta_pre">
                <pre>
<strong>name :</strong> <span>${dataPokemon.name}</span> 
<strong>${dataPokemon.stats[1].stat.name} :</strong> <span>${dataPokemon.stats[1].base_stat}</span> <strong>${dataPokemon.stats[2].stat.name} :</strong> <span>${dataPokemon.stats[2].base_stat}</span>  
<strong>${dataPokemon.stats[3].stat.name} :</strong> <span>${dataPokemon.stats[3].base_stat}</span>         <strong>${dataPokemon.stats[4].stat.name} :</strong> <span>${dataPokemon.stats[4].base_stat}</span>        
<strong>${'height'} :</strong> <span>${dataPokemon.height}</span>           <strong>${'weight'} :</strong> <span>${dataPokemon.height}</span>        
<strong>${dataPokemon.stats[0].stat.name} :</strong> <span>${dataPokemon.stats[0].base_stat}</span>            <strong>${dataPokemon.stats[5].stat.name} :</strong> <span>${dataPokemon.stats[5].base_stat}</span> 
<strong>Experience :</strong> <span>${dataPokemon.base_experience}</span>   
                </pre>
                </div>
            `);

            dataPokemon.abilities.forEach(element => {
                $('#skills').append(`
                    <li>${element.ability.name}</li>
                `);                    
            });

            dataPokemon.types.forEach(element => {
                $('#types').append(`
                    <li>${element.type.name}</li>
                `);                    
            });
            
            $.get("https://pokeapi.co/api/v2/characteristic/" + id + "/", function (data, status) {
                // console.log(status);
                // console.log(data);
                // console.log(data.descriptions[1].description);
               
                if (status === "success") {

                    data.descriptions.forEach(element => {
                       $('.descriptionText').append(`
                            <p class="descript">${element.description}</p>
                       `); 
                    }); 

                }


            }, "json");

            $('#stats').fadeIn(1, ()=>{
                // Transition of the  statistics modal
                $('#stats').attr('transition-duration','2s');
                $('#stats').css('transform','translate(300px, -550px)');                    
            })

            return false;
        });
        //Closes the modal of status 
        closeStatus();
    }

    //Closes the modal of status
    function closeStatus(){
        $('#yellowTriangleS').on('click', ()=>{
            $('#stats').fadeOut(1000,()=>{
                $('.sta_pre').empty();
                $('#skills').empty();
                $('#types').empty();
                $('.descript').empty();
                $('.descriptionText > p').empty();                
                                
            });

        });
    }

    // Opens the modalPokedex with the list of six pokemons stronger
    function pokedex(){
        
        // id or attack of the pokemon stronger
        let array = highestPokemons();
        // let arrayPokHighest = array[0];
        let arrayIdHighest = array[1];
        let arrayStats = array[2];
    
        $('#two').on('click',()=>{

            $('#modalPokedex').fadeIn(1, ()=>{

                //Transition from pokedex modal
                $('#modalPokedex').attr('transition-duration','2s');
                $('#modalPokedex').css('transform','translate(650px, -100px)');  
                
            });

            addSixHighestPoks(arrayIdHighest);
            somaCharacPoks(arrayIdHighest);
            pokemonHover(arrayStats);

            closeModalPokedex();

            return false;
        });
    }

    // Adding the pokemons in the list of the six stronger on the pokedex modal 
    function addSixHighestPoks(arrayIds){
        let pokedexImgsHighest = [];
        //Adding the pokemons in the list of the six stronger
        // Creates a array with the element img
        for (var i = 0; i < 6; i++) {
            let x = arrayIds[i];
            pokedexImgsHighest.push(`<img class="pokStrongs" id="${i}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + x + `.png"/>`);
            frontImgsHighest.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + x + `.png`);
            
            if(x != '798' ){
                backImgsHighest.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${x}.png`);
            }else{
                backImgsHighest.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${x}.png`);
            }
        }

        // Initializes the pokedex with the first pokemons
        for (let i = 0; i < 6; i++) {

            $('#boxPokStrongs').prepend(`
                <div class="col col-sm-4 pok">
                    ${pokedexImgsHighest[i]}
                </div>
            `);
        }
        // Initializes the pokedex with the first pokemons
        // for (let i = 0; i < 6; i++) {
            
        //     $('#boxPokStrongs').append(`

        //         <div class="boxPokvalue">
        //             <strong>Nome: </strong><span>${arrayStats[i][0]}</span><br>
        //             <strong>ATK: </strong><span>${arrayStats[i][2]}</span><br>
        //             <strong>DEF: </strong><span>${arrayStats[i][1]}</span><br>
        //         </div>
        //     `);
        // }

        $('#boxPokStrongs').append(`

            <div class="boxPokvalue">
                <strong>Nome: </strong><span></span><br>
                <strong>ATK: </strong><span><span><br>
                <strong>DEF: </strong><span></span><br>
            </div>
        `);
    }

    // Sum of the characteristics of the pokemons
    function somaCharacPoks(arrayIds){
        
        let weight = 0;
        let baseExp = 0;
        let somaStats = 0;

        // Catching the values of the six pokemons stronger
        for (let i = 0; i < arrayIds.length; i++) {
            let x = arrayIds[i];

            $.get(`https://pokeapi.co/api/v2/pokemon/${x}`, function (data, status) {
            
                if(status === "success"){
                    baseExp += data.base_experience;
                    weight += data.weight;
                    data.stats.forEach(element => {
                        somaStats += element.base_stat;
                    });
                }

                $('#totalStats').text(somaStats);
                $("#totalWeight").text(weight);
                $("#totalHeight").text(baseExp);
                
            },"json");
        
        }   
    }

    // Alters the image of front to back in the pokedex modal
    function pokemonHover(arrayStats){

        $('.pokStrongs').hover(function (){
            let pos = $(this).offset();
            let width = $(this).width();
    
            $('.boxPokvalue').css({
                top: pos.top - 220,
                left: width + pos.left - 650,
                display: 'block'
            });

            var id = $(this).attr('id');

            $('.boxPokvalue').html(`
                    <strong>Nome: </strong><span>${arrayStats[id][0]}</span><br>
                    <strong>ATK: </strong><span>${arrayStats[id][2]}</span><br>
                    <strong>DEF: </strong><span>${arrayStats[id][1]}</span><br>
                `);

            
            $(this).attr('src',backImgsHighest[id]);
            $('.boxPokvalue').fadeIn();
        },function(){
            var id = $(this).attr('id');
            $(this).attr('src',frontImgsHighest[id]);
            $('.boxPokvalue').fadeOut();
        });

    }

    function closeModalPokedex(){

        $('#yellowTriangleTotal').on('click', ()=>{
            $('#boxPokStrongs').html("");
            $('#modalPokedex').fadeOut(1000);
        });
    }

    // makes a search in all the pokemons of the pokeapi and return the id and attack of the six stronger
    function highestPokemons(){
        let temp = 0;
        let id = 0;

        let value = 0;
        let minValue = 0;
        let pokArray = [];
        let pokStats = [];
        let pokStatsArray = [];
        let tempId = [];
        let pos = 0;

        //Search all the pokemons of the pokeapi and catch the pokemons, of  attack biggest 
        for (let index = 1; index <= 802; index++) {

            $.get(`https://pokeapi.co/api/v2/pokemon/${index}`, function (data, status) {

                // console.log(Object.keys(data));
                // console.log(data.stats[4].base_stat);
        
                if (status === "success") {

                    //Receives the value of attack of the pokemon
                    temp = data.stats[4].base_stat;
                    id = data.id; 
            
                    if(pokArray.length < 6){
                        pokStats.push(data.name);
                        pokStats.push(data.stats[3].base_stat);
                        pokStats.push(data.stats[4].base_stat);

                        pokStatsArray.push(pokStatsArray);

                        pokStats.pop();pokStats.pop();pokStats.pop();

                        pokArray.push(temp);
                        tempId.push(id);
                    }else{
                            value = data.stats[4].base_stat;
                            //Receives the smallest value of attack of the array
                            minValue = Math.min.apply(null, pokArray);
        
                            if(value > minValue){
                                pokStats.push(data.name);
                                pokStats.push(data.stats[3].base_stat);
                                pokStats.push(data.stats[4].base_stat);
                                // console.log(pokArray.indexOf(minValue)); 
                                pos = pokArray.indexOf(minValue);
                                pokArray[pos] = value;
                                tempId[pos] = id;
                                pokStatsArray[pos] = pokStats;
                                pokStats = [];
                            }
                    }
                    
                };
        
            }, "json");      
        }
        // console.log(pokArray);
        // console.log(pokStatsArray);
        // console.log(tempId);
        return [pokArray, tempId, pokStatsArray];
    }
    //===================================================================================================
    // Opens a tab with statistics' graph of the pokemon botão 1
    function openGraficoStatus(){
        
        $('#grafico').on('click',()=>{

            if(dataPokemon == null){
                // remove the src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }

            $('#graficoStatsFather').fadeIn(1, ()=>{                   

                //Transition of the modal of graphic
                $('#graficoStatsFather').attr('transition-duration','2s');
                $('#graficoStatsFather').css('transform','translate(300px, -550px)');  
                
                statusGrafico();
            })
            return false;
        });

        closeGraficoStatus();
    }

    function statusGrafico(){

        $("#graficoStats").prepend(`
            <img id="imgStats" src="${dataPokemon.sprites.front_default}"> <span>${dataPokemon.name} </span>
            <canvas id="myChart" width="400" height="400"></canvas>
        `);

        let dados = [];

        dataPokemon.stats.forEach(element => {
            dados.push(element.base_stat);
        });

        var ctx = $("#myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Speed", "Special_Defense", "Special_Attack", "Defense", "Attack", "Hp"],
                datasets: [{
                    data: dados,
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.5)',
                        'rgba(0, 255, 0, 0.5)',
                        'rgba(0, 0, 0, 0.5)',
                        'rgba(128, 0, 128, 0.5)',
                        'rgba(255, 255, 0, 0.5)',
                        'rgba(0, 0, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(138, 14, 14,1)',
                        'rgba(25, 133, 3, 1)',
                        'rgba(10, 10, 10, 1)',
                        'rgba(88, 31, 88, 1)',
                        'rgba(204, 204, 28, 1)',
                        'rgba(12, 12, 140, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {

                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                scales: {
 
                    xAxes: [{
                        categoryPercentage: 0.5,
                        // barPercentage: 1,  
                        gridLines: {
                            display: false,
                            offsetGridLines: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
    }

    function closeGraficoStatus(){

        $('#yellowTriangleGra').on('click', ()=>{

            var c = document.getElementById("myChart");
            var ctx = c.getContext("2d");

            $('#graficoStatsFather').fadeOut(1000,()=>{
                $('#graficoStats').empty();                          
            });

        });
    }

    //===================================================================================================
    // Exhibits the movements of a specific pokemon botão 2
    function showMovs(){

        $('#mov').on('click', ()=>{

            if(dataPokemon == null){
                // remove the src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }
            
            // size of the array of movements
            pokemonMovs = dataPokemon.moves;
            // console.log(pokemonMovs);
            // console.log(dataPokemon);

            $('#movsFather').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#movsFather').attr('transition-duration','2s');
                $('#movsFather').css('transform','translate(300px, -550px)');
            });

            $('#movs').prepend(`
                <div class="movsImg">
                    <img id="imgMovs" src="${dataPokemon.sprites.front_default}"> <span>${dataPokemon.name} </span>
                    <h4>Movimentos</h4>            
                </div>

            `); 
        
            //  If the pokemon don't have 10 movements, does that.
            let controle = 10;
            if(dataPokemon.moves.length < 10){
                controle = dataPokemon.moves.length;
            }
            for (let index = 0; index < controle; index++) {
                //first ten movements
                $('#movs > ul').append(`
                    <li>${dataPokemon.moves[index].move.name}</li>
                `);            

            }

            movsControlPage();
            closeShowMovs();
        });

    }

    function closeShowMovs(){
        $('#yellowTriangleM').on('click', ()=>{
            $('#movsFather').fadeOut(1000, ()=>{
                $('#movs .movsImg').empty();
                $('#movs > ul > li').remove();           
            });

        });
    }
    //===================================================================================================
    // Control of the  buttons of the pagination of  the movements
    function movsControlPage(){

        //adicionando evento de click previous da paginação dos movimentos
        // Adding event of click PREVIOUS of pagination of the movements
        $('.pageM-1').on('click', () => {
            controlePaginacaoMov(--pageMovActual);
        });

        //Adding event of click NEXT of pagination of the movements
        $('.pageM-2').on('click', () => {
            controlePaginacaoMov(++pageMovActual);
        });
        
    }

    // Makes a control of  pagination of the movements page  of the pokemon and receives the state actual of the page
    function controlePaginacaoMov(statePage) {

        if (statePage == 0) {
            statePage += 1;
            pageMovActual += 1;
        }

        if (statePage == 1) {
            $('.pageM-1').hide();
        } else {
            $('.pageM-1').show();
        }

        if (statePage == num_pag_max) {
            pageMovActual = num_pag_max;
            $('.pageM-2').hide();
        } else {
            $('.pageM-2').show();
        }

        pokedexAddMovs();

    }

    function pokedexAddMovs() {

        //  listItems return a array with pagination
        /**
         * If the array has a size 30
         * pageActual = 1
         * limitPage = 10
         * O Parametro pagina atual controla a paginação
         * The parameter pageActual control the pagination
         * pageActual return an array with 10 position 0 ---------- 9
         * pageActual = 2
         * pageActual return an array with 10 position10 ---------- 19
         */
        pokemonM = listItems(pokemonMovs, pageMovActual, limitPage);
        // console.log(pokemonM);   
        $('#movs > ul > li').remove();
        for (let i = 0; i <= pokemonM.length - 1; i++) {

            $('#movs > ul').append(`
                <li id="cleanMovs">${pokemonM[i].move.name}</li>
            `);

        }

    }

    //===================================================================================================
    // Exhibit the  PokeBalls button 3
    function showPokeBalls(){

        $("#balls").on('click', ()=>{

            $('#pokeBallsFather').fadeIn(1, ()=>{
                //Transition of the modal of pokeballs
                $('#pokeBallsFather').attr('transition-duration','2s');
                $('#pokeBallsFather').css('transform','translate(300px, -550px)');
            });

        });

        getPokeballs();
        closePokeBalls();
    }

    function closePokeBalls(){
        $('#yellowTriangleP').on('click', ()=>{
            $('#pokeBallsFather').fadeOut(1000, ()=>{
            
            });

        });
    }

    // Makes a request to obtain the pokeballs
    function getPokeballs(){
        
        for (let index = 1; index <= 16; index++) {
        
            $.get(`https://pokeapi.co/api/v2/item/${index}`, function (data, status) {
                // console.log(data);
                if(status === "success"){

                    $('#pokeBalls > ul').append(`
                        <li class="pokeB" id="p${data.id}"><img class="pokeB" src="${data.sprites.default}"><span>${data.name}</span></li>
                    `);            

                }

            }, 'json');
            
        }

        pokeBallOnClick();
    }

    function pokeBallOnClick(){

        $('ul').on('click','li.pokeB', function(){
            
            var id = $(this).attr('id');
            id = id.split('p');
            // console.log(id);
            id = id[1];

            $('.descriptionP').empty();
            
            $.get(`https://pokeapi.co/api/v2/item/${id}`, function (data, status) {

                if(status === 'success'){

                    $('.descriptionP').append(`
                        <p class="descriptionText">
                            <b>Categoria</b>: ${data.category.name}
                        </p>
                        
                    `);
                    $('.descriptionP').append(`
                        <p class="descriptionText">
                            <b>Effect</b>: ${data.effect_entries[0].effect}                   
                        </p>

                    `);
                    $('.descriptionP').append(`
                        <p class="descriptionText">
                            <b>Short_effect</b>: ${data.effect_entries[0].short_effect}                    
                        </p>

                    `);
                }

            },'json');


        });

    }

    //===================================================================================================
    //Pesquisar pokemon por nome ou id botão 4
    // Search pokemon by name or id button 4
    function searchPoke(){

        $('#search').on('click', ()=>{

            $('#searchPokeFather').fadeIn(1, ()=>{
                //transition from the search modal
                $('#searchPokeFather').attr('transition-duration','2s');
                $('#searchPokeFather').css('transform','translate(300px, -550px)');
            });
        });
        
        $('#searchButton').on('click', ()=>{
            
            // Cleans the fields to insert the values oh the new search
            $('.imgSearch').empty();
            $('.mainData').empty();

            $('.ablitiesData h6').empty();
            $('.typesData h6').empty();
            $('.ablitiesData ul').empty();
            $('.typesData ul').empty();

            let id = $('#inpSearch').val();
            
            if(id == ""){
                return;
            }
            //Clear the fields of the input
            $('#inpSearch').val("");
            
            $.get(`https://pokeapi.co/api/v2/pokemon/${id}`, function (data, status) {

                // console.log(data);
                if(status === 'success'){

                    $('.imgSearch').append(`
                        <div>
                            <img src="${data.sprites.front_default}">
                            <img src="${data.sprites.back_default}">
                            <span><b>Name:</b> ${data.name}</span>                        
                        </div>
                    `);
                    $('.mainData').append(`
                        <div>
                            <span><b>Height:</b> ${data.height}</span>                      
                            <span><b>Weight:</b> ${data.weight}</span>                       
                            <span><b>Base_experience:</b> ${data.base_experience}</span>                       
                            <span><b>Id:</b> ${data.id}</span>                       
                        </div>
                    `);

                    $('.ablitiesData').prepend(`
                         <h6>Abilities Pokemon</h6>
                     `);

                    data.abilities.forEach(element => {
                        $('.ablitiesData ul').append(`
                            <li>${element.ability.name}</li>
                        `);                        
                    });

                    $('.typesData').prepend(`
                         <h6>Types Pokemon</h6>
                     `);

                    data.types.forEach(element => {
                        $('.typesData ul').append(`
                            <li>${element.type.name}</li>
                        `);                        
                    });

                 }

            },'json');
        });

        closeSearchPoke();
    }

    function closeSearchPoke(){
        $('#closeSearch').on('click', ()=>{
            $('#searchPokeFather').fadeOut(1000);
        });
    }
});



window.onresize=function() {
    $width = getDimensions();

}

function getDimensions() {
    
    largura = window.innerWidth;
    var altura = window.innerHeight;
    return largura;
}

getDimensions();

function toggleLights() {

}