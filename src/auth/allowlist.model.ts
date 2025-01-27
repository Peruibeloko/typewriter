interface KvAllowlist {
  email: string;
  registered: boolean;
}

export class Allowlist {
  #id: Deno.KvKey;
  #email: string;
  #registered: boolean;

  get isRegistered() {
    return this.#registered;
  }

  constructor(email: string) {
    this.#id = ['allowlist', email];
    this.#email = email;
    this.#registered = false;
  }

  async register() {
    const kv = await Deno.openKv();
    kv.set(this.#id, true);
    kv.close();
    this.#registered = true;
  }
}
