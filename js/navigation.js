/** Créé un menu de navigation en fonction des données JSON fournie */
class Navigation {
    
    /**
     * @constructor
     * @param  {string} domTarget ID du DOM ou sera créé le menu
     * @param  {JSON} data description des elements du menu au format JSON
     */
    constructor(domTarget,data){
        //récupère l'élément DOM passé en paramètre
        this.domElement = domTarget;

        //contenu de la navigation 
        //data=[
        //  { 
        //  textContent:"textContentBouton",
        //  type:"typeBouton",
        //  id:"idBouton",
        //  onClick:"actionBouton"
        //  ...
        //  },
        //  {
        //    ...
        //  }
        //]
        this.dataNav = data;
        this.nbButton = this.dataNav.length;
        let divNavigation = document.createElement('div');
        divNavigation.classList.add("btnsNavigation");
        Object.keys(this.dataNav).forEach(indexBouton=>{
            var btn = this.initButton(this.dataNav[indexBouton]);
            divNavigation.appendChild(btn);
        });
        document.getElementById(this.domElement).appendChild(divNavigation);
    }
    /**
     * Créé un bouton
     * @param  {keys} objetBtn keys JSON du bouton
     */
    initButton (objetBtn){ //textContentBtn,typeBtn=false,idBtn=false,onClickBtn=false
        let btn = document.createElement('button');
        Object.keys(objetBtn).forEach(btnAttr=>{
            if(btnAttr==="innerHTML"){
                btn.innerHTML = objetBtn[btnAttr];
            }else{
                btn.setAttribute(btnAttr, objetBtn[btnAttr]);
            };
        })
        btn.classList.add("btnNavigation");
        let widthBtn = 100/this.nbButton;
        btn.style.width = widthBtn + "%";
        return btn;
    }

    Onclick(e){
        console.log(e);
    }
}

