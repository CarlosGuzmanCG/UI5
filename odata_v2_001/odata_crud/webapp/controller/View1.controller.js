sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("odatacrud.controller.View1", {
            onInit: function () {
                //this.onReadAll();
                //this.onReadFilter();
                //this.onReadKey();
            },
            onReadAll: function () { // funcion para obtener los valores
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                //datos
                oModel.read("/Products", {
                    success: function (odata) {
                        //console.log(odata);
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    }, error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadFilter: function () {  //Creación de un filtro
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oFilter = new sap.ui.model.Filter('Rating', 'EQ', '3'); //filtro
                oModel.read("/Products", {
                    filters: [oFilter], success: function (odata) { //obtenemos los datos
                        console.log(odata);
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    }, error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadSorter: function () { // ordenar por precio
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); //instancia del modelo
                //console.log(oModel);
                var oSorter = new sap.ui.model.Sorter('Price', true); //filtro
                oModel.read("/Products",
                    {
                        sorters: [oSorter], success: function (odata) { //obtenemos los datos
                            //console.log(odata);
                            var jModel = new sap.ui.model.json.JSONModel(odata);
                            that.getView().byId("idProducts").setModel(jModel);
                        }, error: function (oError) {
                            console.log(oError);
                        }
                    })
            },
            oReadParameters: function () { //Parametros de 0 a 4 datos a mostrar
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); //instancia del modelo
                oModel.read("/Products",
                    {
                        urlParameters: { $skip: 0, $top: 4 },//limitar valores para obtener 
                        success: function (odata) { //obtenemos los datos
                            var jModel = new sap.ui.model.json.JSONModel(odata);
                            that.getView().byId("idProducts").setModel(jModel);
                        }, error: function (oError) {
                            console.log(oError);
                        }
                    })
            },
            onReadKey: function () {  //mostrar un dato por primary key
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); //instancia del modelo
                oModel.read("/Products(2)",
                    {
                        success: function (odata) { //obtenemos los datos
                            var jModel = new sap.ui.model.json.JSONModel({ results: [odata] }); //matriz
                            that.getView().byId("idProducts").setModel(jModel);
                        }, error: function (oError) {
                            console.log(oError);
                        }
                    })
            },
            onEdit: function (oEvent) { //función para editar
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); //Obtenemos el modelo
                oModel.setUseBatch(false); //desactivar el modo de lote (batch)
                if (oEvent.getSource().getText() === 'Edit') { //Obtenemos el boton con el texto
                    oEvent.getSource().setText("Submit"); // cambiamos el valor del texto
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true); // referencia al boton a editar
                } else {
                    oEvent.getSource().setText("Edit"); // cambiamos el valor del texto
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
                    var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue(); //obtenemos el vlor ingresado
                    //console.log(oInput);
                    var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                    //console.log(oId);
                    oModel.update("/Products(" + oId + ")", { Rating: oInput }, { // actualización
                        success: function (odata) {
                            that.getView().byId("idProducts").getModel().refresh(); //obtener los datos nuevos
                            //that.onReadAll();
                        }, error: function (oError) {
                            console.log(oError);
                        }
                    })
                }
            },
            onDuplicate: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); //Obtenemos el modelo
                oModel.setUseBatch(false); //desactivar el modo de lote (batch)
                var oDuplicateData = oEvent.getSource().getBindingContext().getObject(); //obtenemos un array con los valores
                oDuplicateData.ID = 100 + oDuplicateData.ID;
                oModel.create("/Products", oDuplicateData, {
                    success: function (odata) {
                        that.getView().byId("idProducts").getModel().refresh(); //obtener los datos nuevos
                        //that.onReadAll(); //obtener los datos
                    }, error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onDelete: function (oEvent) {
                var that = this;
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false); //desactivar el modo de lote (batch)
                var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                console.log(oId);
                oModel.remove("/Products("+oId+")",{
                    success: function(odata){
                        alert("success");
                        that.getView().byId("idProducts").getModel().refresh(); //obtener los datos nuevos
                        //that.onReadAll();
                    }, error: function (oError) {
                        console.log(oError);
                    }
                })
            }

        });
    });
