  class App{
  /**
   * @description Classe global qui représente l'application
   * @constructor
   */   
  constructor(){
    this.cnx = new Connexion();
    this.content = document.getElementById("content");
    this.table = document.getElementById("dataContent");
    this.form = document.getElementById("formulaire");
  }
  /**
   * Est appelée pour charger les données des véhicules
   */
  LoadVehicle(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.vehicle = new Vehicle();
  }
  /**
   * Est appelée pour charger les données des utilisateurs
   */
  LoadUser(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.user = new User();
  }
  /**
   * Est appelée pour charger les données des réservations
   */
  LoadUsage(){
    this.content.style.justifyContent = "unset";
    this.table.innerHTML = "";
    this.usage = new Usage();
  }
}

class Usage{
  /**
   * @description Classe qui construit l'affichage des réservations
   * @constructor
   */
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsages();
  }
  /**
   * @description Appel les données des réservations
   */
  async GetUsages(){
    await this.req.Get("usages");
    this.listUsages = this.req.json;
  }
  /**
   * @description Met à jour une réservation
   * @param  {String} uri route/_id de la réservation
   * @param  {JSON} json json qui comporte les modifications
   */
  PutUsage(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.usage.DisplayUsages()
      
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Ajoute une nouvelle réservation (il est recommandé d'utilisé l'application mobile)
   * @param  {String} uri route
   * @param  {JSON} json json qui comporte une réservation
   */
  PostUsage(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.usage.DisplayUsages()
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Supprime une réservation
   * @param  {String} uri route/_id de la reservation
   */
  DeleteUsage(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.usage.DisplayUsages()
    );
  }
  /**
   * @description appel l'affichage des réservations
   */
  async DisplayUsages(){
    if(document.getElementById("tableUsage")){
      document.getElementById("tableUsage").remove();
    }
    this.table = new Table("dataContent", "tableUsage");
    this.table.AddHeader([
      "Début",
      "Fin",
      "Objet",
      "Description",
      "Véhicule",
      "Utilisateur",
      "<button class='btnAdd' onclick='app.usage.OnClickAdd()'>+</button>"
    ]);
    await this.GetUsages("usages");
    let table = this.table;
    this.listUsages.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.start,
          element.end,
          element.purpose,
          element.description,
          element.vehicle.registration,
          element.user.name,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }
  /**
   * @description Appel le formulaire d'ajout de réservation
   */
  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.usage.form = new Form("formulaire", [
      {"nom": "start", "type": "text", "value": "Début (jj/mm/aaaa hh:mm)"},
      {"nom": "end", "type": "text", "value": "Fin (jj/mm/aaaa hh:mm)"},
      {"nom": "purpose", "type": "text", "value": "Objet"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "vehicle", "type": "text", "value": "Vehicule"},
      {"nom": "user", "type": "text", "value": "Utilisateur"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.usage.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Récupère l'_id de la reservation à éditer et appel le formulaire
   * @param  {HTMLElement} e Element avec comme id l'_id d'une réservation à éditer
   */
  OnClickEdit(e){
    console.log(e);
    app.usage.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.usage.form = new Form("formulaire", [
      {"nom": "start", "type": "text", "value": "Début (jj/mm/aaaa hh:mm)"},
      {"nom": "end", "type": "text", "value": "Fin (jj/mm/aaaa hh:mm)"},
      {"nom": "purpose", "type": "text", "value": "Objet"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "vehicle", "type": "text", "value": "Vehicule"},
      {"nom": "user", "type": "text", "value": "Utilisateur"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.usage.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'édition
   * @param  {JSON} json json qui comporte les modifications
   */
  Edit(json){
    app.usage.PutUsage("usages/"+app.usage.curId, json);
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'ajout
   * @param  {} json json qui comporte la nouvelle réservation
   */
  Add(json){
    app.usage.PostUsage("usages", json);
  }
  /**
   * @description Méthode ajouté aux bouton supprimé
   * @param  {HTMLElement} e element html qui a pour id l'_id d'une réservation
   */
  Delete(e){
    app.usage.DeleteUsage("usages/"+e.id)
  }
}

class User{
  /**
   * @description Classe qui construit l'affichage des utilisateurs
   * @constructor
   */
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayUsers();
  }
  /**
   * @description Appel les données des utilisateurs
   */
  async GetUsers(){
    await this.req.Get("users");
    this.listUsers = this.req.json;
  }
  /**
   * @description Met à jour un utilisateur
   * @param  {String} uri route/_id de l'utilisateur
   * @param  {JSON} json json qui comporte les modifications
   */
  PutUser(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.user.DisplayUsers()
      
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Ajoute un nouvelle utilisateur
   * @param  {String} uri route
   * @param  {JSON} json json qui comporte un utilisateur
   */
  PostUser(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.user.DisplayUsers()
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Supprime un utilisateur
   * @param  {String} uri route/_id de l'utilisateur
   */
  DeleteUser(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.user.DisplayUsers()
    );
  }
  /**
   * @description appel l'affichage des utilisateurs
   */
  async DisplayUsers(){
    if(document.getElementById("tableUser")){
      document.getElementById("tableUser").remove();
    }
    this.table = new Table("dataContent", "tableUser");
    this.table.AddHeader([
      "Nom",
      "Email",
      "Rôle",
      "<button class='btnAdd' onclick='app.user.OnClickAdd()'>+</button>"
    ]);
    await this.GetUsers("users");
    let table = this.table;
    this.listUsers.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.name,
          element.email,
          element.role.name,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }
  /**
   * @description Appel le formulaire d'ajout d'utilisateur
   */
  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.user.form = new Form("formulaire", [
      {"nom": "name", "type": "text", "value": "Nom"},
      {"nom": "email", "type": "text", "value": "Email"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "role", "type": "text", "value": "Rôle"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.user.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Récupère l'_id de l'utilisateur à éditer et appel le formulaire
   * @param  {HTMLElement} e Element avec comme id l'_id d'un utilisateur à éditer
   */
  OnClickEdit(e){
    console.log(e);
    app.user.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.user.form = new Form("formulaire", [
      {"nom": "name", "type": "text", "value": "Nom"},
      {"nom": "email", "type": "text", "value": "Email"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "role", "type": "text", "value": "Rôle"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.user.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'édition
   * @param  {JSON} json json qui comporte les modifications
   */
  Edit(json){
    app.user.PutUser("users/"+app.user.curId, json);
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'ajout
   * @param  {} json json qui comporte le nouvelle utilisateur
   */
  Add(json){
    app.user.PostUser("auth/register", json);
  }
  /**
   * @description Méthode ajouté aux bouton supprimé
   * @param  {HTMLElement} e element html qui a pour id l'_id d'un utilisateur
   */
  Delete(e){
    app.user.DeleteUser("users/"+e.id)
  }
}

class Vehicle{
  /**
   * @description Classe qui construit l'affichage des véhicules
   * @constructor
   */
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.DisplayVehicles();
  }
  /**
   * @description Appel les données des véhicules
   */
  async GetVehicles(){
    await this.req.Get("vehicles");
    this.listVehicles = this.req.json;
  }
  /**
   * @description Met à jour un véhicule
   * @param  {String} uri route/_id du véhicule
   * @param  {JSON} json json qui comporte les modifications
   */
  PutVehicle(uri, json){
    this.req.Put(uri, json, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
      
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Ajoute un nouveau véhicule
   * @param  {String} uri route
   * @param  {JSON} json json qui comporte un véhicule
   */
  PostVehicle(uri, json){
    this.req.Post(uri, json, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
    );
    app.form.style.display = "none";
    return this.result;
  }
  /**
   * @description Supprime un véhicule
   * @param  {String} uri route/_id du véhicule
   */
  DeleteVehicle(uri){
    this.req.Delete(uri, app.cnx.token).then(
      data => app.vehicle.DisplayVehicles()
    );
  }
  /**
   * @description appel l'affichage des véhicules
   */
  async DisplayVehicles(){
    if(document.getElementById("tableVehicle")){
      document.getElementById("tableVehicle").remove();
    }
    this.table = new Table("dataContent", "tableVehicle");
    this.table.AddHeader([
      "Immatriculation",
      "Description",
      "Autonomie",
      "Energie",
      "Place",
      "<button class='btnAdd' onclick='app.vehicle.OnClickAdd()'>+</button>"
    ]);
    await this.GetVehicles("vehicles");
    let table = this.table;
    this.listVehicles.forEach(element => {
      // console.log(element);
      this.table.AddRow(
        [
          element.registration,
          element.description,
          element.range,
          element.energy,
          element.place,
          table.AddButton(element._id, "Editer", this.OnClickEdit),
          table.AddButton(element._id, "Supprimer", this.Delete)
        ]
        );
      
    });
  }
  /**
   * @description Appel le formulaire d'ajout de véhicule
   */
  OnClickAdd(){
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.vehicle.form = new Form("formulaire", [
      {"nom": "registration", "type": "text", "value": "Immatriculation"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "range", "type": "number", "value": "Autonomie"},
      {"nom": "energy", "type": "text", "value": "Energie"},
      {"nom": "place", "type": "number", "value": "Place"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.vehicle.Add}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Récupère l'_id du véhicule à éditer et appel le formulaire
   * @param  {HTMLElement} e Element avec comme id l'_id du véhicule à éditer
   */
  OnClickEdit(e){
    console.log(e);
    app.vehicle.curId = e.id;
    if(document.getElementById("formulaire").innerHTML != ""){
      document.getElementById("formulaire").innerHTML = "";
    }
    app.vehicle.form = new Form("formulaire", [
      {"nom": "registration", "type": "text", "value": "Immatriculation"},
      {"nom": "description", "type": "text", "value": "Description"},
      {"nom": "range", "type": "number", "value": "Autonomie"},
      {"nom": "energy", "type": "text", "value": "Energie"},
      {"nom": "place", "type": "number", "value": "Place"},
      {"nom": "btnSubmit", "type": "button", "value": "Valider", "onclick": app.vehicle.Edit}
    ]);
    let domForm = document.getElementById("formulaire");
    domForm.style.display = "flex";
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'édition
   * @param  {JSON} json json qui comporte les modifications
   */
  Edit(json){
    app.vehicle.PutVehicle("vehicles/"+app.vehicle.curId, json);
  }
  /**
   * @description Méthode ajouté aux bouton submit du formulaire d'ajout
   * @param  {} json json qui comporte le nouveau véhicule
   */
  Add(json){
    app.vehicle.PostVehicle("vehicles", json);
  }
  /**
   * @description Méthode ajouté aux bouton supprimé
   * @param  {HTMLElement} e element html qui a pour id l'_id d'un véhicule
   */
  Delete(e){
    app.vehicle.DeleteVehicle("vehicles/"+e.id)
  }
}

class Connexion{
  /**
   * @description Classe qui gère la connexion avec l'API
   * @constructor
   */
  constructor(){
    this.req = new ApiInterface("http://151.80.190.149:8005/");
    this.form = new Form("formulaire", [
      {"nom": "title", "type": "label", "value": "Connexion"},
      {"nom": "email", "type": "text", "value": "Identifiant"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "btnSubmit", "type": "button", "value": "Connexion", "onclick": this.Req}
    ]);
    this.token = "";
  }
  /**
   * @description Requete de connexion à l'API
   * @param  {JSON} json json qui comprend les informations de connexion
   */
  async Req(json){
    let req = new ApiInterface("http://151.80.190.149:8005/");
    await req.Post("auth/sign_in", json);
    if(req.json.token){
      app.cnx.token = req.json.token;
      app.cnx.OnConnected();
      
    }else{
      app.cnx.form.Error(req.json.message);
    }
    //console.log(cnx.token);
  }
  /**
   * @description Méthode qui initialise l'application si la connexion réussi
   */
  OnConnected(){
    let btnDisconnect = document.getElementById("btnDisconnect");
    let form = document.getElementById("formulaire");
    form.style.display = "none";
    form.innerHTML = "";
    var dataNav = [
      {
          innerHTML:"Véhicules",
          type:"button",
          id:"btnVehicle",
          onClick:"app.LoadVehicle()"
      },
      {
          innerHTML:"Utilisateurs",
          type:"button",
          id:"btnUser",
          onClick:"app.LoadUser()"
      },
      {
          innerHTML:"Réservations",
          type:"button",
          id:"btnReservation",
          onClick:"app.LoadUsage()"
      },
      {
          innerHTML:"Déconnexion",
          type:"button",
          id:"btnDeconnexion",
          onClick: "app.cnx.Disconnect()"
      }
    ];
    this.nav = new Navigation('nav',dataNav);
  }
  /**
   * @description Méthode de déconnexion
   */
  Disconnect(){
    app.cnx.token = "";
    let content = document.getElementById("dataContent");
    let form = document.getElementById("formulaire");
    let nav = document.getElementById("nav");
    document.getElementById("content").style.justifyContent = "center";
    content.innerHTML = "";
    form.innerHTML = "";
    nav.innerHTML = "";
    app.cnx.form = new Form("formulaire", [
      {"nom": "title", "type": "label", "value": "Connexion"},
      {"nom": "email", "type": "text", "value": "Identifiant"},
      {"nom": "password", "type": "password", "value": "Mot de passe"},
      {"nom": "btnSubmit", "type": "button", "value": "Connexion", "onclick": this.Req}
    ]);
    form.style.display = "flex";

  }


}

class Form{
  /** 
   * @description Classe qui construit un formulaire
   * @constructor
   * @param  {String} domTargetId Id de l'element html qui va contenir le formulaire
   * @param  {} json Données au format json qui décrivent le formulaire
   */
  constructor(domTargetId, json){
    this.domTarget = document.getElementById(domTargetId);
    this.data = json;
    this.InitForm();
  }
  /**
   * @description Initialise la création du formulaire
   */
  InitForm(){
    // this.form = document.createElement("FORM");
    // this.form.id = this.id;
    // this.domTarget.appendChild(this.form);
    let form = this;
    this.data.forEach(function(e){
      let input = form.CreateInput(e);
      form.domTarget.appendChild(input);
    })
  }
  /**
   * @description construit un input
   * @param  {JSON} data description au format json de l'input voulu
   */
  CreateInput(data){
    let input;
    switch(data.type){
      case "text":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputText");
        input.placeholder = data.value;
      break;
      case "number":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputNumber");
        input.placeholder = data.value;
      break;
      case "password":
        input = document.createElement("INPUT");
        input.name = data.nom;
        input.type = data.type;
        input.classList.add("inputPw");
        input.placeholder = data.value;
      break;
      case "button":
        input = document.createElement("BUTTON");
        input.id = data.nom;
        input.classList.add("btnSubmit");
        let form = this;
        input.addEventListener("click", function(e){
          e.preventDefault();
          form.OnSubmit(data.onclick);
        });
        input.innerHTML = data.value;
      break;
      case "label":
        input = document.createElement("LABEL");
        input.id = data.nom;
        input.classList.add("label");
        input.innerHTML = data.value;
      break;
    }
    //console.log(input);
    return input;
  }
  /**
   * @description méthode utiliser lors du click sur le bouton submit
   * @param  {Function} callback fonction callback avec comme argument le json de réponse de l'API
   */
  OnSubmit(callback){
    let res = this.ToJson(this.domTarget);
    callback(res);
  }
  /**
   * @description Récupère les valeurs d'un formulaire et les converties en json
   * @param  {HTMLElement} form Balise html de type form
   */
  ToJson(form){
    var field = [];
    var s = {};
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (let j=form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            //s[encodeURIComponent(field.name)] = encodeURIComponent(field.options[j].value);
                            s[field.name] = field.options[j].value;
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    if(field.value != ""){
                      //s[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
                      s[field.name] = field.value;
                    }
                }
            }
        }
    }
    return JSON.stringify(s);
  }
  /**
   * @description Notifie l'utilisateur en cas d'erreur
   * @param  {String} msg message d'erreur
   */
  Error(msg){
    if(document.getElementById("errorMsg")){
      let textError = document.getElementById("errorMsg");
      textError.innerHTML = msg;
    }else{
      let textError = document.createElement("SPAN");
      textError.innerHTML = msg;
      textError.id = "errorMsg";
      textError.style.border = "3px solid red";
      this.domTarget.appendChild(textError);
    }
  }
}

class Table{
  /**
   * @description construit un tableau HTML
   * @constructor
   * @param  {String} domTargetId Id de l'element html qui va contenir le tableau
   * @param  {String} id Id du futur tableau (resultat: content+id)
   */
  constructor(domTargetId, id){
    this.id = id;
    this.domTarget = document.getElementById(domTargetId);
    this.InitTable();
  }
  /**
   * @description initialise la construction du tableau
   */
  InitTable(){
    this.domContent = document.getElementById("content");
    this.contentTable = document.createElement('DIV');
    this.contentTable.id = "content" + this.id;
    this.domTarget.appendChild(this.contentTable);
    this.table = document.createElement('TABLE');
    this.table.id = this.id;
    this.contentTable.appendChild(this.table);
  }
  /**
   * @description construit l'entete du tableau
   * @param  {Array} array tableau qui contient la liste des entetes dans l'ordre voulu
   */
  AddHeader(array){
    this.thead = document.createElement("THEAD");
    this.table.appendChild(this.thead);
    let rowTH = document.createElement("TR");
    this.thead.appendChild(rowTH);
    array.forEach(function(e){
      let cellHead = document.createElement("TH");
      cellHead.innerHTML = e;
      rowTH.appendChild(cellHead);
    })
  }
  /**
   * @description ajoute une ligne au tableau
   * @param  {Array} array tableau qui contient les données de la ligne
   */
  AddRow(array){
    let table = this;
    let row = document.createElement("TR");
    array.forEach(function(e){
      row.appendChild(table.AddCell(e));
    })
    this.table.appendChild(row);
  }
  /**
   * @description ajoute une cellule
   * @param  {HTMLElement} content contenue de la cellule
   */
  AddCell(content){
    //console.log(content);
    let cell = document.createElement("TD");
    if(typeof content === "object"){
      cell.appendChild(content);
    }else if(typeof content === "number"){
      cell.innerHTML = content;
    }else if(moment(content).isValid()){
      let date = moment(content);
      cell.innerHTML = date.format("DD/MM/YYYY hh:mm");
    }else{
      cell.innerHTML = content;
    }
    
    return cell;
  }
  /**
   * @description créé un bouton
   * @param  {String} id id du bouton
   * @param  {String} value titre du bouton
   * @param  {Function} onclick action du bouton
   */
  AddButton(id, value, onclick){
    let btn = document.createElement("BUTTON");
    btn.type = "button";
    btn.addEventListener("click", function(){
      onclick(this);
    });
    btn.id = id;
    btn.innerHTML = value;
    return btn;
  }

}

class ApiInterface{
    /**
     * @description Classe qui fait appel à l'API
     * @constructor
     * @param  {String} url url de l'API
     */
    constructor(url){
      this.url = url;
    }
    /**
     * @description Envoi une requete HTTP de type GET
     * @param  {String} uri uri de la requete
     */
    async Get (uri){
      this.response = await fetch(this.url + uri);
      this.json = await this.response.json();
    }
    
    /**
     * @description Envoi une requete HTTP de type PUT
     * @param  {} uri uri de la requete
     * @param  {} json données au format json à envoyer
     * @param  {} token="" token d'autorisation si besoin
     */
    async Put(uri, json, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "put",
        body: json,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
      return this.json;
    }
    /**
     * @description Envoi une requete HTTP de type POST
     * @param  {} uri uri de la requete
     * @param  {} json données au format json à envoyer
     * @param  {} token="" token d'autorisation si besoin
     */
    async Post(uri, json, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "post",
        body: json,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
    }
    /**
     * @description Envoi une requete HTTP de type DELETE
     * @param  {} uri uri de la requete
     * @param  {} token="" token d'autorisation si besoin
     */
    async Delete(uri, token = ""){
      this.response = await fetch(this.url + uri, {
        method: "delete",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+token
        }
      });
      this.json = await this.response.json();
    }
}