let db = null;

/**
 * ����������� � indexedDb
 * @returns {Promise<boolean>}
 */
async function DBConnect() {
	// �������� ����� ������, ����� �� �������� ��������� ��
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('PEFL', 1);

		request.onupgradeneeded = async function (event) {
			db = event.target.result;

			await createObjetStores(['teams', 'players', 'divs']);

			console.log('IndexedDB init!');
		}

		// ���������� �� �������� ����������
		request.onsuccess = function (event) {
			db = event.target.result;
			console.log("IndexedDB open!");
			resolve(db);
		}

		// ���������� �� ������
		request.onerror = function (event) {
			console.log('Problem with opening DB. Go to CRAB VIP forum!');
			reject('IndexedDB error connect!');
		}
	});
}

async function createObjetStores(storeNames) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		storeNames.forEach((storeName) => {
			// ���� ��������� ���� -> ������� ���
			if (db.objectStoreNames.contains(storeName)) {
				db.deleteObjectStore(storeName);
			}

			// ������� ����� (������) ���������
			let objectStore = db.createObjectStore(storeName, {keyPath: 'id'});
			objectStore.transaction.oncomplete = function () {
				Std.debug("All objectStores has created.");
			}
		});

		resolve(true);
	});
}

/**
 * ���������� ������� � ���������� �������.
 * ���� �� ������ ����� ��� ��� ����� �� ������ -> ����������.
 *
 * @param storeName �������� store (�������)
 * @param object
 * @returns {Promise<unknown>}
 */
async function addObject(storeName, object) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// ������� ���������� �� ���� ���������
		const transaction = db.transaction(storeName, 'readwrite');
		// �������� ��������� ��� ������ � ���
		const table = transaction.objectStore(storeName);

		table.put(object);
		transaction.oncomplete = () => {
			resolve(true); // success
		};

		transaction.onerror = () => {
			reject(transaction.error); // failure
		};
	});
}

/**
 * ���������� �������� �� ��� ����������� ����� � �������
 * @param storeName
 * @param name
 * @param val
 * @returns {Promise<unknown>}
 */
async function setByName(storeName, name, val) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// ������� ���������� �� ���� ���������
		const transaction = db.transaction(storeName, 'readwrite');
		// �������� ��������� ��� ������ � ���
		const table = transaction.objectStore(storeName);

		table.put(val, name);
		transaction.oncomplete = () => {
			resolve(true); // success
		};

		transaction.onerror = () => {
			reject(transaction.error); // failure
		};
	});
}

/**
 * ��������� ���� ������� � �������
 * @param storeName
 * @returns {Promise<unknown>}
 */
async function getAll(storeName) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// ������� ���������� �� ���� ���������
		const transaction = db.transaction(storeName, 'readonly');
		// �������� ��������� ��� ������ � ���
		const table = transaction.objectStore(storeName);

		const request = table.getAll();
		request.onsuccess = () => {
			resolve(request.result); // success
		};

		request.onerror = () => {
			reject(request.error); // failure
		};
	});
}

/**
 * ��������� ������� �� ��� ����� � ���������� �������
 *
 * @param storeName �������� store (�������)
 * @param key
 * @returns {Promise<unknown>}
 */
async function getByKey(storeName, key) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// ������� ���������� �� ���� ���������
		const transaction = db.transaction(storeName, 'readonly');
		// �������� ��������� ��� ������ � ���
		const table = transaction.objectStore(storeName);

		const request = table.get(key);
		request.onsuccess = () => {
			resolve(request.result); // success
		};

		request.onerror = () => {
			reject(request.error); // failure
		};
	});
}
