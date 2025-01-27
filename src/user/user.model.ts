interface KvUser {
  displayName: string;
  secret: string;
}

export class User {
  #id: Deno.KvKey;
  #displayName: string;
  #secret: string;

  public get displayName(): string {
    return this.#displayName;
  }

  public get secret(): string {
    return this.#secret;
  }

  public get id(): Deno.KvKey {
    return this.#id;
  }

  constructor(displayName: string, secret: string) {
    this.#id = ['users', crypto.randomUUID()];
    this.#displayName = displayName;
    this.#secret = secret;
  }

  static async find(id: Deno.KvKey) {
    const kv = await Deno.openKv();
    const { value: user } = await kv.get<KvUser>(id);
    kv.close();
    return user === null ? null : new User(user.displayName, user.secret);
  }

  async save() {
    const kv = await Deno.openKv();
    await kv.set(this.#id, {
      displayName: this.#displayName,
      secret: this.#secret
    });
    kv.close();
  }
}
