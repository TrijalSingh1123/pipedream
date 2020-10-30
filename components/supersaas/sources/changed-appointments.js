const supersaas = require('../supersaas.app.js');

module.exports = {
  key: 'supersaas-changed-appointments',
  name: 'New or changed appointments',
  description: `Emits an event for every changed appointments from the selected schedules.`,
  version: '0.0.1',

  props: {
    supersaas,
    schedules: { propDefinition: [supersaas, 'schedules'] },
    db: "$.service.db",
    http: '$.interface.http',
  },

  hooks: {
    async activate() {
      const { http, schedules } = this;

      this.db.set('activeHooks', await this.supersaas.createHooks(schedules.map(x => ({
        event: 'C', // change_appointment
        parent_id: Number(x),
        target_url: http.endpoint,
      }))));
    },

    async deactivate() {
      await this.supersaas.destroyHooks(this.db.get('activeHooks') || []);
      this.db.set('activeHooks', []);
    },
  },

  async run(ev) {
    console.log('Emitting:', ev.body);
    this.$emit(ev.body);
  },
};
