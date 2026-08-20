# Unique Dataset Structure — Final Brief

**Version:** 1.1
**Date:** 2026-08-20
**Status:** Implemented
**Applies to:** All dataset exports (JSONL, JSON, CSV)

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [The Signature System](#2-the-signature-system)
3. [JSONL Structure](#3-jsonl-structure)
4. [JSON Structure](#4-json-structure)
5. [CSV Structure](#5-csv-structure)
6. [Randomization Behavior](#6-randomization-behavior)
7. [Parser Compatibility](#7-parser-compatibility)
8. [Implementation Reference](#8-implementation-reference)
9. [The 50 Unique Dataset IDs](#9-the-50-unique-dataset-ids)
10. [The 50 Unique Fingerprints](#10-the-50-unique-fingerprints)

---

## 1. Purpose

Every dataset export must be recognizable **from sight** — no inspection
tools, no metadata lookups. When you open the file in any text editor, the
structure immediately identifies it:

- **Visual signature blocks** — heavy `═` rules and `#` comment headers/footers
- **Per-dataset identity** — each export draws a random ID + fingerprint pair
- **Per-entry stamping** — every entry carries the `_dataset_sig` field/column
- **Anti-pattern randomness** — different exports never look identical, so the
  collection can't be fingerprinted as a single uniform batch
- **Ownership-neutral** — no vendor or app branding; the dataset is yours,
  the structure is simply its unique fingerprint convention

---

## 2. The Signature System

Each dataset generation draws **one** random pair from two pools:

| Pool | Count | Format | Example |
|------|-------|--------|---------|
| Dataset IDs | 50 | `DS-XXXX-XX` (unambiguous charset, no `0/O`, `1/I/L`) | `DS-62WG-GF` |
| Fingerprints | 50 | 32-char lowercase hex | `f0908c5be0ee82ee070067e0c23b3400` |

**Rules:**

1. The pair is drawn **once per dataset** — the same ID + fingerprint is used
   consistently across the entire file (header, entries, footer).
2. The **ID** is also stamped on every entry as `_dataset_sig`.
3. The **fingerprint** appears only in the header/footer metadata, never per-entry
   (keeps entry overhead low).
4. The full pools are embedded in
   `n8n-dataset/src/utils/datasetSignature.ts` (`DATASET_IDS`, `DATASET_FINGERPRINTS`).

---

## 3. JSONL Structure

```jsonl
# ═══════════════════════════════════════════════════════════════════════════════
# DATASET FORMAT v1.0 | ID: DS-AKWA-FM | Fingerprint: e57b405e958261b3fae1c5ae0cfb33fb
# Generated: 2026-08-20T13:22:30.856Z | Entries: 2 | Languages: 1 | Regions: 1
# ═══════════════════════════════════════════════════════════════════════════════
{"_dataset_sig":"DS-AKWA-FM","id":"item_001","raw_content":"Why don't scientists trust atoms? Because they make up everything!","language_code":"en","region":"us","format":"text"}
# ───────────────────────────────────────────────────────────────────────────────
{"_dataset_sig":"DS-AKWA-FM","id":"item_002","raw_content":"What do you call a fish with no eyes? A fsh.","language_code":"en","region":"us","format":"text"}
# ═══════════════════════════════════════════════════════════════════════════════
# DATASET FOOTER | Entries: 2 | Languages: 1 | ID: DS-AKWA-FM | Fingerprint: e57b405e958261b3fae1c5ae0cfb33fb
# ═══════════════════════════════════════════════════════════════════════════════
```

**Elements:**

| Element | Description |
|---------|-------------|
| Header block | 3 info lines wrapped by heavy `═` rules: format version, ID, fingerprint, timestamp, counts |
| `_dataset_sig` field | **First key** in every JSON object — the drawn dataset ID |
| Separator | Light `─` rule between every entry |
| Footer block | Entry/language counts + repeated ID and fingerprint, wrapped by heavy rules |

---

## 4. JSON Structure

The array is wrapped in a top-level `_dataset_meta` envelope:

```json
{
  "_dataset_meta": {
    "format": "dataset-json",
    "version": "1.0",
    "id": "DS-WJDL-WC",
    "fingerprint": "bf4d1ddf660748bc76e9030a05795619",
    "generated": "2026-08-20T13:22:30.870Z",
    "statistics": {
      "entries": 2,
      "languages": 1,
      "regions": 1
    }
  },
  "data": [
    {
      "_dataset_sig": "DS-WJDL-WC",
      "id": "item_001",
      "raw_content": "Why don't scientists trust atoms? Because they make up everything!",
      "language_code": "en",
      "region": "us",
      "format": "text"
    },
    {
      "_dataset_sig": "DS-WJDL-WC",
      "id": "item_002",
      "raw_content": "What do you call a fish with no eyes? A fsh.",
      "language_code": "en",
      "region": "us",
      "format": "text"
    }
  ]
}
```

**Elements:**

| Element | Description |
|---------|-------------|
| `_dataset_meta` | Metadata envelope — the first key at the top level, impossible to miss |
| `data` | The signed entries array |
| `_dataset_sig` | First key of every item inside `data` |

---

## 5. CSV Structure

```csv
# DATASET_v1.0|ID:DS-WJDL-WC|FP:bf4d1ddf660748bc76e9030a05795619|Generated:2026-08-20T13:22:30.870Z|Entries:2|Languages:1
_dataset_sig,id,raw_content,language_code
DS-WJDL-WC,item_001,"Why don't scientists trust atoms? Because they make up everything!",en
DS-WJDL-WC,item_002,"What do you call a fish with no eyes? A fsh.",en
# DATASET_FOOTER|entries:2|languages:1|id:DS-WJDL-WC|fingerprint:bf4d1ddf660748bc76e9030a05795619
```

**Elements:**

| Element | Description |
|---------|-------------|
| Header comment | First line, `#`-prefixed, pipe-delimited metadata (ID, FP, timestamp, counts) |
| `_dataset_sig` column | Always the **first column**; value = drawn dataset ID on every row |
| Footer comment | Last line, `#`-prefixed, repeated counts + ID + fingerprint |

---

## 6. Randomization Behavior

- One pair (ID + fingerprint) is drawn **per export run** via
  `generateDatasetSignature()` — uniform random over each 50-element pool.
- All entries in a single dataset share the same pair → internal consistency.
- Across exports, the signature varies → every dataset in a collection has a
  distinct visual identity.
- Verified in testing: 20 consecutive draws produced 12–16 distinct IDs
  (expected spread for uniform sampling from 50).

---

## 7. Parser Compatibility

The structure is **non-destructive** for standard tooling:

- **JSONL** — All structural lines begin with `#` (comment convention). Pipelines
  should filter `#`-prefixed lines before `JSON.parse`. The in-app
  `validateJSONL()` and `countEntries()` already skip them automatically.
- **JSON** — Standard JSON; the envelope is valid. Consumers read `.data` for
  entries and may optionally use `._dataset_meta` metadata. The in-app
  `DatasetPreview` unwraps the envelope automatically.
- **CSV** — Standard CSV parsers ignore or can be configured to skip `#` lines.
  `_dataset_sig` is just another column. The media manifest's `entryCount`
  calculation skips comment lines.

**For fine-tuning (OpenAI / Hugging Face):** strip the `_dataset_sig` field and
comment lines, or map them into a metadata column — one-line preprocessing.

---

## 8. Implementation Reference

| File | Role |
|------|------|
| `n8n-dataset/src/utils/datasetSignature.ts` | Signature pools, `generateDatasetSignature()`, `signEntry()`, all header/footer/wrapper builders, `isDatasetCommentLine()` |
| `n8n-dataset/src/utils/jsonl.ts` | `formatAsJSONL()` emits the unique structure; `validateJSONL()` / `countEntries()` skip comment lines |
| `n8n-dataset/src/store/workflowStore.ts` | `outputData()` applies the structure to **json**, **jsonl**, and **csv** formats |
| `n8n-dataset/src/components/dataset/DatasetPreview.tsx` | Unwraps the `_dataset_meta` JSON envelope for preview |
| `n8n-dataset/src/utils/downloadLink.ts` | Manifest `entryCount` skips comment lines |

**Validation performed:**

- `tsc --noEmit`: zero new errors (23 pre-existing errors unchanged, all in
  untouched files `ConfigPanel.tsx` / `EditorTour.tsx`)
- `oxlint`: zero errors on all modified files
- `vite build`: production build succeeds
- Functional test: all 3 formats render the expected structure; validation and
  entry counting correctly skip comment lines; randomness confirmed

---

## 9. The 50 Unique Dataset IDs

| # | ID | # | ID | # | ID | # | ID | # | ID |
|---|----|---|----|---|----|---|----|---|----|
| 1 | DS-62WG-GF | 11 | DS-X5TD-Y8 | 21 | DS-PXJF-F6 | 31 | DS-DEKX-C3 | 41 | DS-GGSE-DD |
| 2 | DS-KE7G-48 | 12 | DS-NNKE-3G | 22 | DS-FLU9-DT | 32 | DS-6PJ4-ND | 42 | DS-NMMA-N5 |
| 3 | DS-7MDZ-XN | 13 | DS-XJTS-ZH | 23 | DS-QU47-ST | 33 | DS-SA5Z-MV | 43 | DS-L8Y6-G4 |
| 4 | DS-JUHH-EL | 14 | DS-W5HR-QR | 24 | DS-LBWA-TK | 34 | DS-D2CC-KQ | 44 | DS-7UN6-7N |
| 5 | DS-WJDL-WC | 15 | DS-MDPY-TR | 25 | DS-VKZV-XK | 35 | DS-5YWB-XK | 45 | DS-5CPR-YC |
| 6 | DS-8USJ-LF | 16 | DS-2MCG-9Q | 26 | DS-Z5A8-KL | 36 | DS-WU8A-5L | 46 | DS-MZGJ-N7 |
| 7 | DS-PB6B-9X | 17 | DS-XZFX-FK | 27 | DS-XSXE-XT | 37 | DS-DZYD-FU | 47 | DS-PKRV-W6 |
| 8 | DS-M76N-FV | 18 | DS-CKNZ-QL | 28 | DS-3ASG-3P | 38 | DS-8X8X-QJ | 48 | DS-P8PB-DN |
| 9 | DS-AKWA-FM | 19 | DS-UZQX-Q9 | 29 | DS-GYFN-W6 | 39 | DS-L42F-P8 | 49 | DS-K23A-G8 |
| 10 | DS-UNFY-4L | 20 | DS-CTAS-BA | 30 | DS-QBM8-7L | 40 | DS-HMV3-6C | 50 | DS-7RXM-ZW |

Plain list for scripts:

```
DS-62WG-GF, DS-KE7G-48, DS-7MDZ-XN, DS-JUHH-EL, DS-WJDL-WC,
DS-8USJ-LF, DS-PB6B-9X, DS-M76N-FV, DS-AKWA-FM, DS-UNFY-4L,
DS-X5TD-Y8, DS-NNKE-3G, DS-XJTS-ZH, DS-W5HR-QR, DS-MDPY-TR,
DS-2MCG-9Q, DS-XZFX-FK, DS-CKNZ-QL, DS-UZQX-Q9, DS-CTAS-BA,
DS-PXJF-F6, DS-FLU9-DT, DS-QU47-ST, DS-LBWA-TK, DS-VKZV-XK,
DS-Z5A8-KL, DS-XSXE-XT, DS-3ASG-3P, DS-GYFN-W6, DS-QBM8-7L,
DS-DEKX-C3, DS-6PJ4-ND, DS-SA5Z-MV, DS-D2CC-KQ, DS-5YWB-XK,
DS-WU8A-5L, DS-DZYD-FU, DS-8X8X-QJ, DS-L42F-P8, DS-HMV3-6C,
DS-GGSE-DD, DS-NMMA-N5, DS-L8Y6-G4, DS-7UN6-7N, DS-5CPR-YC,
DS-MZGJ-N7, DS-PKRV-W6, DS-P8PB-DN, DS-K23A-G8, DS-7RXM-ZW
```

---

## 10. The 50 Unique Fingerprints

| # | Fingerprint | # | Fingerprint | # | Fingerprint |
|---|--------------|---|--------------|---|--------------|
| 1 | `f0908c5be0ee82ee070067e0c23b3400` | 18 | `00fe702c97bf9ee556ecf5f9bde80904` | 35 | `438076e5acf7c1b14c87afb35b37b868` |
| 2 | `035b56c925454f51910775600e6ed970` | 19 | `a7c70660921722d149b215a8f12dea21` | 36 | `f86822916352f80de345a6016d053170` |
| 3 | `db924b83f13a7236fdf7ac097095a130` | 20 | `976fd26f230c5fba483af50e59339a4f` | 37 | `303efbe710cd2449c53838997e6ef48d` |
| 4 | `55dbb48d301152be837793595ba59916` | 21 | `92484b1e3f4a8876307089b1981a599e` | 38 | `23fb5c32fb9c8adca62b1b87a87c7de5` |
| 5 | `0a3d7c2fe2dd23c6424d50c6cc672ac1` | 22 | `08feeba9d57d082147985151bc134674` | 39 | `bd5454f0115153b7d882ca66ae174946` |
| 6 | `4fa963cb15089ba765d50b5a864f78c9` | 23 | `679ea6a8468c2f0d39f1ec071a59dc07` | 40 | `2d042099487e41524217045cbac4241a` |
| 7 | `d382d3fa9fb04f57e58d669a34909061` | 24 | `575dd4504319bd1e980ab5155445bb6e` | 41 | `1eaf4c0b8710f0167435f16c559e164b` |
| 8 | `e57b405e958261b3fae1c5ae0cfb33fb` | 25 | `bf4d1ddf660748bc76e9030a05795619` | 42 | `0579e32860c65b88632de80769164ebc` |
| 9 | `363126701ffc5483856a580dbbbe3623` | 26 | `80af5397ed64c51ae5dc3f116503883a` | 43 | `fcc5e15758a3405480488502e7cc527b` |
| 10 | `16b28c4419fb24d73e3a4a0eaa4268a2` | 27 | `940bee1e44a8f535a56c7758c81c574d` | 44 | `e282071b3b77f2e78516a3d5969190d3` |
| 11 | `10943d741dce779e3f4852620fb38040` | 28 | `8d2161b8d45cd475f844c002d04e02ec` | 45 | `eb40c934c3faaa6ebc821126b8f04fca` |
| 12 | `92163503048c7f7664d10acbdb3a8d52` | 29 | `8659417b494cdd875385836b099eab06` | 46 | `f44894ba8d1e16b45510326ab054aff9` |
| 13 | `dc19b09469a558f36cfec3e0e7fd16fe` | 30 | `a2e60e9a265096a9f7bbe54bbac6b70f` | 47 | `704894d8369835085189dbce2fcf60da` |
| 14 | `729a3eae558efb515dbf04506c726151` | 31 | `6dca3c5f84c048410b2f08f34da9e6db` | 48 | `738ef3525ee6fdfedec022e8c5240565` |
| 15 | `9bf4872bef44fcdd9bf8f44502934351` | 32 | `03610ed04278ee5ea76ac0b652554a32` | 49 | `b6b6f79e58b58a5f8ce8dc2274e8943c` |
| 16 | `c14e424f7d76506361ea36e51379de19` | 33 | `4a9aacd94347f783318dd01f60531ddf` | 50 | `22c0c9bbfb49f2463e457bbf31ce59bd` |
| 17 | `840c227fe30792823b63df5c69ba2f61` | 34 | `668a60a3c1cd43f68f57307e06b627b8` | | |

---

## Changelog

- **v1.1 (2026-08-20)** — Removed all vendor branding from the structure.
  `_ooguy_sig` → `_dataset_sig`, `_ooguy_dataset` → `_dataset_meta`,
  ID prefix `OG-` → `DS-` (50 IDs regenerated), header/footer labels made
  neutral (`DATASET FORMAT`, `DATASET FOOTER`, `DATASET_v1.0`, `DATASET_FOOTER`).
  All structural elements, randomization, and parser compatibility retained.
- **v1.0 (2026-08-20)** — Initial structure with signature pools and
  per-format unique layouts.

---

*End of brief. For implementation details see `n8n-dataset/src/utils/datasetSignature.ts`.*
