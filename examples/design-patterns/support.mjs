// Teaching adapters for application-port tests. No database or broker is used.
class SerializedMemoryStore {
  tail = Promise.resolve();
  async exclusively(work) {
    const previous = this.tail;
    let release;
    this.tail = new Promise(resolve => { release = resolve; });
    await previous;
    try { return await work(); } finally { release(); }
  }
}

export class MemoryTransferUow extends SerializedMemoryStore {
  balances = new Map([['alice', 100], ['bob', 0]]);
  async run(work) {
    return this.exclusively(async () => {
      const draft = new Map(this.balances);
      const balance = id => {
        if (!draft.has(id)) throw new Error('Missing account');
        return draft.get(id);
      };
      const result = await work({
        debit: async (id, amount) => {
          const next = balance(id) - amount;
          if (next < 0) throw new Error('Insufficient funds');
          draft.set(id, next);
        },
        credit: async (id, amount) => { draft.set(id, balance(id) + amount); },
      });
      this.balances = draft;
      return result;
    });
  }
}

export class MemoryOutboxStore extends SerializedMemoryStore {
  orders = new Map([['order-1', 'draft']]);
  events = new Map();
  failInsert = false;
  failMark = false;
  async transaction(work) {
    return this.exclusively(async () => {
      const orders = new Map(this.orders);
      const events = structuredClone(this.events);
      await work({
        confirmOrder: async id => {
          if (!orders.has(id)) throw new Error('Missing order');
          if (orders.get(id) === 'confirmed') return false;
          orders.set(id, 'confirmed');
          return true;
        },
        insert: async event => {
          if (this.failInsert) throw new Error('Outbox write failed');
          if (events.has(event.id)) throw new Error('Duplicate event ID');
          events.set(event.id, { ...event, published: false });
        },
      });
      this.orders = orders;
      this.events = events;
    });
  }
  async pending(limit) {
    return [...this.events.values()].filter(e => !e.published).slice(0, limit)
      .map(({ published, ...event }) => ({ ...event }));
  }
  async markPublished(id) {
    return this.exclusively(async () => {
      if (this.failMark) throw new Error('Acknowledgement write failed');
      this.events.get(id).published = true;
    });
  }
}

export class MemorySagaStore extends SerializedMemoryStore {
  states = new Map();
  commands = new Map();
  failEnqueue = false;
  async transaction(id, work) {
    return this.exclusively(async () => {
      let draft = structuredClone(this.states.get(id));
      const commands = structuredClone(this.commands);
      await work({
        state: draft,
        save: next => { draft = structuredClone(next); },
        enqueue: command => {
          if (this.failEnqueue) throw new Error('Command write failed');
          if (commands.has(command.id)) throw new Error('Duplicate command');
          commands.set(command.id, structuredClone(command));
        },
      });
      this.states.set(id, draft);
      this.commands = commands;
    });
  }
}
