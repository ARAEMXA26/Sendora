export class KeyGenerator {
  generateKey(durasiHari: number): string {
    const seed = Math.random().toString(36).slice(2, 12).toUpperCase();
    const ttl = durasiHari === 30 ? "30D" : "07D";
    return `BT-${ttl}-${seed.slice(0, 4)}-${seed.slice(4, 8)}`;
  }

  validateKey(kode: string): boolean {
    return /^BT-(07D|30D)-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(kode);
  }
}
