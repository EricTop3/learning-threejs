/**
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

THREE.DragControls = function ( _objects, _camera, _domElement ) {

    /** 改 **/
    var scope = this
    scope._objects = _objects


    var _plane = new THREE.Plane();
    var _raycaster = new THREE.Raycaster();

    var _mouse = new THREE.Vector2();
    var _offset = new THREE.Vector3();
    var _intersection = new THREE.Vector3();
    var _worldPosition = new THREE.Vector3();
    var _inverseMatrix = new THREE.Matrix4();
    var _intersections = [];

    var _selected = null, _hovered = null;


    function activate() {

        _domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
        _domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
        _domElement.addEventListener( 'mouseup', onDocumentMouseCancel, false );
        _domElement.addEventListener( 'mouseleave', onDocumentMouseCancel, false );
        _domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
        _domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
        _domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );

    }

    function deactivate() {

        _domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        _domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
        _domElement.removeEventListener( 'mouseup', onDocumentMouseCancel, false );
        _domElement.removeEventListener( 'mouseleave', onDocumentMouseCancel, false );
        _domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
        _domElement.removeEventListener( 'touchstart', onDocumentTouchStart, false );
        _domElement.removeEventListener( 'touchend', onDocumentTouchEnd, false );

    }

    function dispose() {

        deactivate();

    }
    /** 改 */
    function getObjects() {

        return scope._objects

    }
    /** 改 增加updateObjects */
    this.updateObjects = function(_objects) {
        scope._objects = _objects
    }
    function onDocumentMouseMove( event ) {

        event.preventDefault();

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

        _raycaster.setFromCamera( _mouse, _camera );

        if ( _selected && scope.enabled ) {

            if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

                _selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) )

                /** 改 **/
                if(_selected.userData.isRackGroup) {
                    _selected.position.y = 11
                }else if(_selected.userData.isBox) {
                    //
                }else {
                    _selected = null
                }

            }

            scope.dispatchEvent( { type: 'drag', object: _selected } );

            return;

        }

        _intersections.length = 0;

        _raycaster.setFromCamera( _mouse, _camera );
        _raycaster.intersectObjects( _objects, true, _intersections );

        if ( _intersections.length > 0 ) {

            var object = _intersections[ 0 ].object;

            _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

            if ( _hovered !== object ) {

                scope.dispatchEvent( { type: 'hoveron', object: object } );

                _domElement.style.cursor = 'pointer';
                _hovered = object;

            }

        } else {

            if ( _hovered !== null ) {

                scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

                _domElement.style.cursor = 'auto';
                _hovered = null;

            }

        }

    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        _intersections.length = 0;

        _raycaster.setFromCamera( _mouse, _camera );
        _raycaster.intersectObjects( _objects, true, _intersections );

        if ( _intersections.length > 0 ) {

            _selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

            /**  改：**/
            if(_selected.name === 'rackGroupBottom') {
                _selected = _selected.parent
            }else if(_selected.userData.isRack && !_selected.userData.isEmpty) {
                //
                _selected = _selected.children[0]
            }else if (_selected.userData.isBox){
               // _selected = _selected
            }else {
                _selected = null //其他物体不让拖拽 比如 货架孔
                return  false
			}

            if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

                _inverseMatrix.getInverse( _selected.parent.matrixWorld );
                _offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

            }

            _domElement.style.cursor = 'move';

            scope.dispatchEvent( { type: 'dragstart', object: _selected } );

        }


    }

    function onDocumentMouseCancel( event ) {

        event.preventDefault();

        if ( _selected ) {

            scope.dispatchEvent( { type: 'dragend', object: _selected } );

            _selected = null;

        }

        _domElement.style.cursor = _hovered ? 'pointer' : 'auto';

    }

    function onDocumentTouchMove( event ) {

        event.preventDefault();
        event = event.changedTouches[ 0 ];

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

        _raycaster.setFromCamera( _mouse, _camera );

        if ( _selected && scope.enabled ) {

            if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

                _selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

            }

            scope.dispatchEvent( { type: 'drag', object: _selected } );

            return;

        }

    }

    function onDocumentTouchStart( event ) {

        event.preventDefault();
        event = event.changedTouches[ 0 ];

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

        _intersections.length = 0;

        _raycaster.setFromCamera( _mouse, _camera );
        _raycaster.intersectObjects( _objects, true, _intersections );

        if ( _intersections.length > 0 ) {

            _selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

            _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

            if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

                _inverseMatrix.getInverse( _selected.parent.matrixWorld );
                _offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

            }

            _domElement.style.cursor = 'move';

            scope.dispatchEvent( { type: 'dragstart', object: _selected } );

        }


    }

    function onDocumentTouchEnd( event ) {

        event.preventDefault();

        if ( _selected ) {

            scope.dispatchEvent( { type: 'dragend', object: _selected } );

            _selected = null;

        }

        _domElement.style.cursor = 'auto';

    }

    activate();

    // API

    this.enabled = true;
    this.transformGroup = false;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
    this.getObjects = getObjects;

};

THREE.DragControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DragControls.prototype.constructor = THREE.DragControls;
