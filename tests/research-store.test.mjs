import test from "node:test";
import assert from "node:assert/strict";
import {
  applyAction,
  createSeedDatabase,
  researcherHubs,
} from "../src/lib/research-store.ts";
const accountInput = {
  name: "Periset Uji",
  email: "uji@periset.id",
  password: "uji12345",
  role: "periset",
  locationId: "jakarta",
};
const entryInput = {
  title: "Riset terapan baru",
  year: 2026,
  description: "Deskripsi riset",
  publisher: "Jurnal",
  identifier: "DEMO",
  url: "https://example.com/research",
};

test("seed has both roles, complete profiles, portfolio rows, and correct map counts", () => {
  const db = createSeedDatabase();
  assert.equal(db.accounts.filter((a) => a.role === "admin").length, 2);
  assert.equal(db.accounts.filter((a) => a.role === "periset").length, 16);
  assert.equal(db.profiles.length, db.accounts.length);
  for (const kind of ["publications", "copyrights", "works"])
    assert.equal(db[kind].length, 16);
  assert.equal(
    researcherHubs(db).reduce((n, h) => n + h.count, 0),
    16,
  );
  assert.equal(researcherHubs(db).filter((h) => h.count).length, 14);
});
test("anonymous and researcher account mutations are rejected", () => {
  const db = createSeedDatabase();
  for (const actor of [null, "missing", "r1"]) {
    assert.throws(() =>
      applyAction(db, actor, { type: "account.save", input: accountInput }),
    );
    assert.throws(() =>
      applyAction(db, actor, { type: "account.delete", id: "r2" }),
    );
  }
});
test("admin account creation, duplicate email validation, role changes, and map updates", () => {
  const db = createSeedDatabase();
  let next = applyAction(db, "u1", {
    type: "account.save",
    input: accountInput,
  });
  const created = next.accounts.find((a) => a.email === accountInput.email);
  assert.ok(created);
  assert.equal(created.password, accountInput.password);
  assert.equal(
    next.profiles.find((p) => p.userId === created.id).locationId,
    "jakarta",
  );
  assert.equal(
    researcherHubs(next).reduce((n, h) => n + h.count, 0),
    17,
  );
  assert.throws(
    () =>
      applyAction(next, "u1", {
        type: "account.save",
        input: { ...accountInput, email: " UJI@PERISET.ID " },
      }),
    /sudah digunakan/,
  );
  next = applyAction(next, "u1", {
    type: "account.save",
    id: created.id,
    input: { ...accountInput, password: "", role: "admin" },
  });
  assert.equal(
    next.accounts.find((a) => a.id === created.id).password,
    accountInput.password,
  );
  assert.equal(
    researcherHubs(next).reduce((n, h) => n + h.count, 0),
    16,
  );
  assert.equal(db.accounts.length, 18, "original database is immutable");
});
test("self deletion and removal of the last admin are prevented", () => {
  const db = createSeedDatabase();
  assert.throws(
    () => applyAction(db, "u1", { type: "account.delete", id: "u1" }),
    /sedang digunakan/,
  );
  const next = applyAction(db, "u1", { type: "account.delete", id: "admin2" });
  assert.throws(
    () =>
      applyAction(next, "u1", {
        type: "account.save",
        id: "u1",
        input: { ...accountInput, role: "periset" },
      }),
    /satu Admin/,
  );
});
test("demotion takes effect for subsequent mutations", () => {
  const db = createSeedDatabase();
  const account = db.accounts.find((a) => a.id === "admin2");
  const next = applyAction(db, "u1", {
    type: "account.save",
    id: account.id,
    input: { ...account, role: "periset", locationId: "medan" },
  });
  assert.throws(
    () => applyAction(next, "admin2", { type: "account.delete", id: "r1" }),
    /Hanya Admin/,
  );
});
test("profile ownership, identity uniqueness, bio, photo, and location validation", () => {
  const db = createSeedDatabase();
  const owner = db.accounts.find((a) => a.id === "r1");
  const profile = db.profiles.find((p) => p.userId === "r1");
  const action = {
    type: "profile.save",
    userId: "r1",
    name: owner.name,
    email: owner.email,
    input: { ...profile, bio: "Biografi baru", locationId: "jayapura" },
  };
  const next = applyAction(db, "r1", action);
  assert.equal(
    next.profiles.find((p) => p.userId === "r1").bio,
    "Biografi baru",
  );
  assert.equal(researcherHubs(next).find((h) => h.id === "jayapura").count, 2);
  assert.throws(() => applyAction(db, "r2", action), /profil sendiri/);
  assert.throws(
    () => applyAction(db, "r1", { ...action, email: "periset2@periset.id" }),
    /sudah digunakan/,
  );
  assert.throws(
    () =>
      applyAction(db, "r1", {
        ...action,
        input: { ...profile, avatar: "data:image/svg+xml;base64,xxx" },
      }),
    /Foto/,
  );
  assert.throws(
    () =>
      applyAction(db, "r1", {
        ...action,
        input: { ...profile, bio: "x".repeat(1001) },
      }),
    /Biografi/,
  );
  assert.throws(
    () =>
      applyAction(db, "r1", {
        ...action,
        input: { ...profile, locationId: "unknown" },
      }),
    /lokasi/,
  );
});
for (const kind of ["publications", "copyrights", "works"]) {
  test(`${kind}: create, edit, ownership enforcement, delete, and persistence round-trip`, () => {
    let db = createSeedDatabase();
    db = applyAction(db, "r1", {
      type: "entry.save",
      kind,
      input: { ...entryInput, userId: "r2" },
    });
    let created = db[kind].at(-1);
    assert.equal(created.userId, "r1", "owner cannot be forged");
    assert.throws(
      () =>
        applyAction(db, "r2", {
          type: "entry.save",
          kind,
          id: created.id,
          input: entryInput,
        }),
      /karya sendiri/,
    );
    assert.throws(
      () =>
        applyAction(db, "r2", { type: "entry.delete", kind, id: created.id }),
      /karya sendiri/,
    );
    db = applyAction(db, "r1", {
      type: "entry.save",
      kind,
      id: created.id,
      input: { ...entryInput, title: "Judul diperbarui" },
    });
    db = JSON.parse(JSON.stringify(db));
    created = db[kind].find((e) => e.id === created.id);
    assert.equal(created.title, "Judul diperbarui");
    assert.equal(db[kind].length, 17);
    db = applyAction(db, "r1", { type: "entry.delete", kind, id: created.id });
    assert.equal(db[kind].length, 16);
  });
}
test("reject unsafe links, invalid years, and blank titles", () => {
  const db = createSeedDatabase();
  for (const patch of [
    { url: "javascript:alert(1)" },
    { url: "data:text/html,test" },
    { year: 1800 },
    { year: NaN },
    { title: "  " },
  ]) {
    assert.throws(() =>
      applyAction(db, "r1", {
        type: "entry.save",
        kind: "publications",
        input: { ...entryInput, ...patch },
      }),
    );
  }
});
test("account deletion cascades through profiles and all portfolio tables", () => {
  const next = applyAction(createSeedDatabase(), "u1", {
    type: "account.delete",
    id: "r1",
  });
  assert.ok(!next.accounts.some((a) => a.id === "r1"));
  for (const table of ["profiles", "publications", "copyrights", "works"])
    assert.ok(!next[table].some((e) => e.userId === "r1"));
});
test("password update verifies existing password and persists new value", () => {
  const db = createSeedDatabase();
  assert.throws(() =>
    applyAction(db, "r1", {
      type: "password.save",
      current: "wrong",
      password: "newpass123",
    }),
  );
  const next = applyAction(db, "r1", {
    type: "password.save",
    current: "periset123",
    password: "newpass123",
  });
  assert.equal(next.accounts.find((a) => a.id === "r1").password, "newpass123");
});
