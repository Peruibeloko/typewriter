import { Filesystem } from '@/persistence/filesystem.ts';
import { Kv } from '@/persistence/kv.ts';

export class Persistence {
  #kv: Kv;
  #filesystem: Filesystem;

  constructor(base: string[], filesystemPath?: string, kvPath?: string) {
    this.#kv = new Kv(kvPath ? [...base, kvPath] : base);
    this.#filesystem = new Filesystem(filesystemPath ? [...base, filesystemPath] : base);
  }

  public get kv(): Kv {
    return this.#kv;
  }

  public get filesystem(): Filesystem {
    return this.#filesystem;
  }
}
