import PouchDB from 'pouchdb';
import bind from 'bind-decorator';

export default class Pouch {
    constructor(dbname, readonly = false, remoteOptions = false) {
        this.listeners = [];
        this.db = new PouchDB(dbname);
        if (remoteOptions) {
            const remotedb = PouchDB(dbname, remoteOptions);
            if (!readonly) {
                this.db.sync(remotedb, { live: true, retry: true });
            }
            else {
                this.db.replicate.from(remotedb, { live: true, retry: true });
            }
        }
        this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', this.onChange);
    }

    addListener(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
            return () => {
                this.listeners.map(l => l !== listener);
            };
        }
        throw new Error('Listener is not a function');
    }

    @bind
    onChange(...args) {
        this.listeners.forEach(l => l(...args));
    }

    add(doc) {
        const docToAdd = { ...doc, dateCreated: new Date().toISOString() };
        return this.update(docToAdd);
    }

    update(doc) {
        const docToUpdate = { ...doc, dateLastUpdated: new Date().toISOString() };
        return this.db.put(docToUpdate).then((status) => {
            if (status.ok) {
                docToUpdate._rev = status.rev; // eslint-disable-line
                return docToUpdate;
            }
            return status;
        });
    }

    remove(doc) {
        return this.db.remove(doc);
    }

    @bind
    get(id, settings = {}) {
        return this.db.get(id, settings);
    }

    getAll(settings = { include_docs: true, decending: true }) {
        return this.db.allDocs(settings).then(res => res.rows.map(d => d.doc));
    }   
}