export default class SensorMeta {

  constructor(config) {
      this._id = config.id;
      this._name = config.name;
      this._desc = config.desc;
      this._model = config.model;
      this._monitor = config.monitor;
      this._values = config.values;
      this._alarm = config.alarm;
  }


  get id() {
      return this._id;
  }

  get name()
  {
      return this._name;
  }

  get desc()
  {
      return this._desc;
  }

  get model()
  {
      return this._model;
  }
  get monitor()
  {
      return this._monitor;
  }

  get values()
  {
      return this._values;
  }

  get alarm()
  {
      return this._alarm;
  }


}
