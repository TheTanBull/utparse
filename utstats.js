const CosmosClient = require("@azure/cosmos").CosmosClient;
const env = require("./config.json");
const config = env.config;
let client = null;
let database = null;
let container = null;

const init = async () => {
    client = new CosmosClient({
        endpoint: config.host,
        auth: {
            masterKey: config.authKey
        }
    });
    const dbResponse = await client.databases.createIfNotExists({
        id: config.databaseId
    });
    database = dbResponse.database;
    const coResponse = await database.containers.createIfNotExists({
        id: config.collectionId
    });
    container = coResponse.container;
}

const addItem = async (item) => {
    item.date = Date.now();
    const { body: doc } = await container.items.create(item);
    // const body = await container.items.create(item);
    // const doc = body.doc;
    return doc;
}

const queryItems = async (query) => {
    if(!container) {
        throw new Error("No collection initialized!");
    }
    const { result: results } = await container.items
        .query(query)
        .toArray();
    return results;
}

const getItemById = async (id) => {
    const { body } = await container.item(id).read();
    return body;
}

const updateItem = async(item) => {
    const oldItem = await getItemById(item.id);
    const newItem = {...oldItem, ...item};

    const { body: replaced } = await container.item(newItem.id).replace(newItem);
    return replaced;
}

const deleteDatabase = async() => {
    // it will really be gone if you run this. For real.
    await database.delete();
}

const queryCosmo = (q, callback) => {
    init()
    // .then(async () => {
    //     const res = await addItem({
    //         match: {
    //             map: {
    //                 name: "Morpheus",
    //                 author: "not cliffy b"
    //             },
    //             actions: [
    //                 1, 2, 3, 4
    //             ],
    //             info: {
    //                 name: "uhhh?"
    //             }
    //         }
    //     });
    //     console.log(res);
    // })
    // .catch(err => {
    //     console.log("There was a problem initializing the database. See error below!", err);
    // })
    .then(async () => {
        const query = {
            query: "SELECT r.match.map FROM root AS r WHERE r.match.map.name=@mapname",
            parameters: [
                {
                    name: "@mapname",
                    value: "Morpheus"
                }
            ]
        };
        const results = await queryItems(query);
        data = {};
        data.results = results;
        callback(null, data);
        // console.log(data);
        // return data;
    })
    .catch(err => {
        callback(err, null);
    })
}


module.exports = {
    init: init,
    addItem: addItem,
    queryItems: queryItems,
    getItemById: getItemById,
    updateItem: updateItem,
    queryCosmo: queryCosmo
}