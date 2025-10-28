Ext.define('ProductApp.model.Product', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'int', allowNull: true }, // Allow null for new records
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'price', type: 'float' },
        { name: 'quantity', type: 'int' }
    ],
    
    validators: {
        name: 'presence',
        price: { type: 'presence' }
    },
    
    idProperty: 'id', // Explicitly set idProperty
    clientIdProperty: null // Disable client-side ID generation
});

Ext.define('ProductApp.store.ProductStore', {
    extend: 'Ext.data.Store',
    
    alias: 'store.productstore',
    
    model: 'ProductApp.model.Product',
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'http://localhost:8080/api/products', // Use full URL
            create: 'http://localhost:8080/api/products',
            update: 'http://localhost:8080/api/products',
            destroy: 'http://localhost:8080/api/products'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: false,
            transform: {
                fn: function(data, request) {
                    if (request.getAction() === 'create') {
                        console.log('Writer transforming data:', data); // Log for debugging
                        delete data.id; // Remove id for create operations
                    }
                    return data;
                }
            }
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PUT',
            destroy: 'DELETE'
        },
        buildUrl: function(request) {
            var url = this.getUrl(request);
            var operation = request.getOperation();
            var records = operation.getRecords() || [];
            var record = records[0];
            
            if (record && (operation.isUpdateOperation() || operation.isDestroyOperation())) {
                url = url + '/' + record.getId();
            }
            
            request.setUrl(url);
            return this.callParent([request]);
        }
    },
    
    autoLoad: true,
    autoSync: false
});
Ext.define('ProductApp.view.ProductForm', {
    extend: 'Ext.window.Window',
    
    alias: 'widget.productform',
    
    title: 'Product Form',
    width: 400,
    modal: true,
    layout: 'fit',
    
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            bodyPadding: 10,
            reference: 'form',
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name',
                allowBlank: false
            }, {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: 'Description'
            }, {
                xtype: 'numberfield',
                name: 'price',
                fieldLabel: 'Price',
                allowBlank: false,
                minValue: 0,
                decimalPrecision: 2
            }, {
                xtype: 'numberfield',
                name: 'quantity',
                fieldLabel: 'Quantity',
                value: 0,
                minValue: 0,
                allowDecimals: false
            }],
            buttons: [{
                text: 'Save',
                formBind: true,
                handler: 'onSaveProduct'
            }, {
                text: 'Cancel',
                handler: function() {
                    this.up('window').close();
                }
            }]
        }];
        
        this.callParent(arguments);
    }
});

Ext.define('ProductApp.view.MainView', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'ProductApp.view.ProductForm',
        'ProductApp.store.ProductStore'
    ],
    
    controller: 'productcontroller',
    
    renderTo: Ext.getBody(),
    width: '100%',
    height: 600,
    layout: 'fit',
    title: 'Product Management System',
    
    tbar: [{
        text: 'Add Product',
        iconCls: 'x-fa fa-plus',
        handler: 'onAddProduct'
    }, {
        text: 'Refresh',
        iconCls: 'x-fa fa-refresh',
        handler: 'onRefresh'
    }],
    
    items: [{
        xtype: 'grid',
        reference: 'productGrid',
        store: {
            type: 'productstore'
        },
        columns: [{
            text: 'ID',
            dataIndex: 'id',
            width: 60
        }, {
            text: 'Name',
            dataIndex: 'name',
            flex: 1
        }, {
            text: 'Description',
            dataIndex: 'description',
            flex: 2
        }, {
            text: 'Price',
            dataIndex: 'price',
            width: 100,
            renderer: function(value) {
                return '$' + Ext.util.Format.number(value, '0.00');
            }
        }, {
            text: 'Quantity',
            dataIndex: 'quantity',
            width: 100
        }, {
            xtype: 'actioncolumn',
            text: 'Actions',
            width: 100,
            items: [{
                iconCls: 'x-fa fa-edit',
                tooltip: 'Edit',
                handler: 'onEditProduct'
            }, {
                iconCls: 'x-fa fa-trash',
                tooltip: 'Delete',
                handler: 'onDeleteProduct'
            }]
        }],
        listeners: {
            itemdblclick: 'onEditProduct'
        }
    }]
});

Ext.define('ProductApp.controller.ProductController', {
    extend: 'Ext.app.ViewController',
    
    alias: 'controller.productcontroller',
    
    onAddProduct: function() {
        var form = Ext.create('ProductApp.view.ProductForm', {
            title: 'Add Product'
        });
        form.show();
    },
    
    onEditProduct: function(grid, record) {
        var form = Ext.create('ProductApp.view.ProductForm', {
            title: 'Edit Product'
        });
        form.down('form').loadRecord(record);
        form.show();
    },
    
    onDeleteProduct: function(grid, rowIndex, colIndex, item, e, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this product?', function(btn) {
            if (btn === 'yes') {
                var store = grid.getStore();
                store.remove(record);
                store.sync({
                    success: function() {
                        Ext.toast({
                            html: 'Product deleted successfully',
                            title: 'Success',
                            align: 'tr',
                            iconCls: 'x-fa fa-check'
                        });
                        store.reload();
                    },
                    failure: function() {
                        Ext.toast({
                            html: 'Failed to delete product',
                            title: 'Error',
                            align: 'tr',
                            iconCls: 'x-fa fa-exclamation'
                        });
                        store.reload();
                    }
                });
            }
        });
    },
    
	onSaveProduct: function(button) {
	    var window = button.up('window');
	    var form = window.down('form');
	    var grid = this.lookupReference('productGrid');
	    var store = grid.getStore();
	    
	    if (form.isValid()) {
	        var values = form.getValues();
	        console.log('Form values before processing:', values); // Log raw form values
	        
	        var record = form.getRecord();
	        if (record) {
	            // Editing existing product
	            console.log('Editing record with ID:', record.getId());
	            record.set(values);
	        } else {
	            // Creating new product
	            delete values.id; // Explicitly remove id field
	            console.log('Form values after removing id:', values); // Log modified values
	            record = Ext.create('ProductApp.model.Product', values);
	            store.add(record);
	        }
	        
	        console.log('Record data before sync:', record.getData()); // Log record data
	        store.sync({
	            success: function() {
	                console.log('Sync successful');
	                Ext.toast({
	                    html: 'Product saved successfully',
	                    title: 'Success',
	                    align: 'tr',
	                    iconCls: 'x-fa fa-check'
	                });
	                store.reload();
	                window.close();
	            },
	            failure: function(batch) {
	                console.log('Sync failed:', batch.exceptions); // Log detailed error
	                Ext.toast({
	                    html: 'Failed to save product',
	                    title: 'Error',
	                    align: 'tr',
	                    iconCls: 'x-fa fa-exclamation'
	                });
	                store.reload();
	            }
	        });
	    } else {
	        console.log('Form is invalid:', form.getForm().getErrors());
	        Ext.toast({
	            html: 'Please fill out all required fields',
	            title: 'Error',
	            align: 'tr',
	            iconCls: 'x-fa fa-exclamation'
	        });
	    }
	},
    
    onRefresh: function() {
        var grid = this.lookupReference('productGrid');
        var store = grid.getStore();
        store.reload();
    }
});

Ext.application({
    name: 'ProductApp',
    
    launch: function() {
        Ext.create('ProductApp.view.MainView');
    }
});
