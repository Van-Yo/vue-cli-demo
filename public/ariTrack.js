/**
 * 指哪飞哪
 * 初始化 options{}
 * options.viewer: cesium viewer
 * options.initPosition : Cesium.Cartesian3.fromDegrees(long, lat, height)
 * 例如：
 * this.droneAnimator = new DroneFlightAnimator({ viewer, Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 28) }, (msg) => {
      console.log(msg)
   })
*/
class DroneFlightAnimator {
  constructor(options,callback) {
    this.viewer = options.viewer;
    this.initPosition = options.initPosition
    this.droneEntity = this.viewer.entities.add({
      position:this.initPosition,
      model: {
        uri: 'air.glb', // 请替换为实际的无人机模型路径
        minimumPixelSize: 64,
      },
    });
    this.flightPath = null;
    this.callback = callback
    this.primitivesone = null;
    this.primitivestwo = null;
    this.spotLightCamera = null;
  }
  
  /**
   * options{}
   * options.aircraftLongitude   // 无人机经度（必传）
   * options.aircraftLatitude     // 无人机纬度（必传）
   * options.aircraftAltitude     // 无人机高度（必传）
   * options.gimbalPitchValue     // 无人机云台俯仰角
   * options.gimbalYawValue     // 无人机云台偏航角
   * options.isShoot      // 是否为拍摄点
  */
  flyTo(options) {
    this.RemovePrimitives()
    let destination = Cesium.Cartesian3.fromDegrees(options.aircraftLongitude, options.aircraftLatitude, options.aircraftAltitude)
    const startLocation = this.droneEntity.position.getValue(Cesium.JulianDate.now());
    const startTime = Cesium.JulianDate.now();

    const distance = Cesium.Cartesian3.distance(startLocation, destination);
    const duration = distance / 30; // 假设速度为每秒50米

    const positions = [startLocation];

    this.flightPath = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return positions;
        }, false),
        width: 3,
        material: Cesium.Color.RED
      },
    });
    const tickHandler=()=>{
      const elapsedSeconds = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.now(),
        startTime
      );
      const t = elapsedSeconds / duration;
      // console.log(t);
      if (t >= 1.0) {
        // console.log(t);

        // 这里非常重要
        // 一定要更新一次t=1的时候飞机以及航线位置
        // 不然t=0.971523180793504时飞行即结束，这时候其实飞机还没有飞行到指定坐标点
        // t=0表示飞机在上个坐标点，t=1表示飞机在下一个坐标点，（0，1）表示飞机在两坐标之间
        const newPosition = Cesium.Cartesian3.lerp(
          startLocation,
          destination,
          1,
          new Cesium.Cartesian3()
        );
        this.droneEntity.position.setValue(newPosition);
        positions.push(newPosition);


        this.drawPoint(this.droneEntity.position.getValue(destination))
        if(options.isShoot){
          this.SetLookCone({
            destination,
            gimbalPitchValue:options.gimbalPitchValue,
            gimbalYawValue:options.gimbalYawValue
          })
        }
        
        this.callback(this.droneEntity.position.getValue(destination))
        this.viewer.clock.onTick.removeEventListener(tickHandler);
        return;
      }
      
      const newPosition = Cesium.Cartesian3.lerp(
        startLocation,
        destination,
        t,
        new Cesium.Cartesian3()
      );
      this.droneEntity.position.setValue(newPosition);
      positions.push(newPosition);
    }
    this.viewer.clock.onTick.addEventListener(tickHandler);
  }
  drawPoint(position){
    this.viewer.entities.add({
      // fromDegrees（经度，纬度，高度，椭球，结果）从以度为单位的经度和纬度值返回Cartesian3位置
      position,
      point: {
        // 点的大小（像素）
        pixelSize: 5,
        // 点位颜色，fromCssColorString 可以直接使用CSS颜色
        color: Cesium.Color.fromCssColorString('#ee0000'),
        // 边框颜色
        outlineColor: Cesium.Color.fromCssColorString('#fff'),
        // 边框宽度(像素)
        outlineWidth: 2,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
        // 是否显示
        show: true
      }
    });
  }
  /**
     * 删除视锥
     */
  RemovePrimitives() {
    if (this.primitivesone) {
      this.primitivesone.destroy()
      this.primitivestwo.destroy()
      this.spotLightCamera = null;
    }
  }
  SetLookCone(value) {

    this.RemovePrimitives()

    // setTimeout(() => {
    //     this.RemovePrimitives()
    // }, 2800)

    // value = this.Lines.filter(function (item) {
    //     return item.shootId == value;
    // });

    // value = value[0]
    let positions = value.destination
    this.spotLightCamera = new Cesium.Camera(this.viewer.scene);
    let spotLightCamera = this.spotLightCamera

    spotLightCamera.setView({
        destination: positions,
        orientation: {
            heading: Cesium.Math.toRadians(value.gimbalYawValue),
            pitch: Cesium.Math.toRadians(value.gimbalPitchValue),
            roll: Cesium.Math.toRadians(0.0)
        }
    });



    let scratchRight = new Cesium.Cartesian3();
    let scratchRotation = new Cesium.Matrix3();
    var scratchOrientation = new Cesium.Quaternion();

    let position = spotLightCamera.positionWC;
    let directions = spotLightCamera.directionWC;
    let up = spotLightCamera.upWC;
    let right = spotLightCamera.rightWC;
    right = Cesium.Cartesian3.negate(right, scratchRight);

    let rotation = scratchRotation;
    Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
    Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
    Cesium.Matrix3.setColumn(rotation, 2, directions, rotation);
    //计算视锥姿态
    let orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation);
    spotLightCamera.frustum.near = 0.1;
    spotLightCamera.frustum.far = 10;
    //视锥轮廓线图形

    let instanceOutline = new Cesium.GeometryInstance({
        geometry: new Cesium.FrustumGeometry({
            frustum: spotLightCamera.frustum,
            origin: position,
            orientation: orientation
        }),
        material: Cesium.Color.RED.withAlpha(1),
        id: "pri" + this.viewer.scene.primitives.length + 1,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 0.5)),
            show: new Cesium.ShowGeometryInstanceAttribute(true)
        }
    });

    let instance = new Cesium.GeometryInstance({
        geometry: new Cesium.FrustumOutlineGeometry({
            frustum: spotLightCamera.frustum,
            origin: position,
            orientation: orientation
        }),
        material: Cesium.Color.RED.withAlpha(0.1),
        id: "pri0" + this.viewer.scene.primitives.length + 1,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 1)),
            show: new Cesium.ShowGeometryInstanceAttribute(true)
        }
    });

    this.primitivesone = this.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            flat: true
        }),
        asynchronous: false
    }));

    this.primitivestwo = this.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instanceOutline,
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            flat: true
        }),
        asynchronous: false
    }));

}
}