sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("modeloperations.controller.emp", {

            onInit: function () {

                this.giStudentId=0;

                this.student = {
                    id:this.giStudentId,
                    firstName : "",
                    middleName : "",
                    lastName:"",
                    gender:0,
                    genderText:"Female",
                    dateOfBirth:"",
                    fatherName:"",
                    contactNumber:"",
                    alternativeNumber:""
                };
                this.data = {
                    students: [],
                    student:this.student
                };
            },
            onAfterRendering : function(){ //modelo view
                var oModel = new sap.ui.model.json.JSONModel(this.data); //modelo
                this.getView().setModel(oModel);//configuración del modelo para la vista
            },
            handleAddStudent: function (oEvent) { //modelo de dialogo
                if (!this.newStudentDialog) { //verificamos si esta abierto 
                    this.newStudentDialog = sap.ui.xmlfragment("modeloperations.fragment.register", this);//llamamos al fragment  
                    
                    //modelo json
                    var oModel = new sap.ui.model.json.JSONModel();
                    this.newStudentDialog.setModel(oModel);
                }

                this.student.id=this.giStudentId;
                
                var data = JSON.parse(JSON.stringify(this.student));//limpieza de los datos
                this.newStudentDialog.getModel().setData(data)//this.student); //pasamos el array 
                //console.log(this.student);
                this.newStudentDialog.open();// abrimos el fragment 

            },
            handleCancelBtnPress: function () {
                this.newStudentDialog.close();
            },
            handleSaveBtnPress : function(oEvent){ 
                var oModel = oEvent.getSource().getModel(); //obtenemos el modelo
                var oDialogData = oModel.getData(); //obtenemos los datos del modelo
                var oViewData = this.getView().getModel().getData();//para obtener los datos de un modelo asociado a la vista actual
                if(this.gbEditing){
                    for(var i =0; i<oViewData.student.length;i++){//
                        var temp = oViewData.students[i];
                        if(temp.id === oDialogData.id){
                            temp = oDialogData;
                            temp.genderText=(temp.gender)?"Male":"Female";
                            oViewData.students[i] = temp;
                            break;
                        }
                    }
                    this.gbEditing=false;
                    oDialogData.genderText=(oDialogData.gender)?"Male":"Female";
                    this.getView().getModel().setData(oViewData);
                    this.newStudentDialog.close();
                    return;
                }

                oDialogData.genderText=(oDialogData.gender)?"Male":"Female";//mapear valores
                //console.log(oDialogData.gender);
                
                oViewData.students.push(oDialogData);// empujamos los datos
                this.getView().getModel().setData(oViewData); //actualizar el modelo de datos asociado a la vista actual
                this.giStudentId++; // id + 1
                this.newStudentDialog.close();
            },
            handleEditStudent : function(oEvent){
                var oCurrentStudent = oEvent.getSource().getBindingContext().getObject();
                this.newStudentDialog.getModel().setData(oCurrentStudent);
                this.newStudentDialog.open();
                this.gbEditing = true; // para saber si se esta editando
            },
            handleDeleteStudent : function(oEvent){
                var oCurrentStudent = oEvent.getSource().getBindingContext().getObject();
                var oViewData = this.getView().getModel().getData();
                for(var i =0; i<oViewData.students.length;i++){
                    var temp = oViewData.students[i];
                    if(temp.id === oCurrentStudent.id){
                        oViewData.students.splice(i,1);
                        break;
                    }
                }
                this.getView().getModel().setData(oViewData);
            }
        });
    });
