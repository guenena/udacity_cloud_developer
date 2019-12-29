import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import * as AWS from '../../../../aws';
import {sequelize} from "../../../../sequelize";

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
        if(item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});

router.get('/:id',
    async (req: Request, res: Response) => {
        const {id} = req.params
        const item = await FeedItem.findByPk(id);
        res.status(200).send(item);
    });

router.patch('/:id',
    async (req: Request, res: Response) => {
        const {caption, url} = req.body;
        if (caption == null && url == null) {
            res.send(200);
            return;
        }
        const {id} = req.params;
        const item = await FeedItem.findByPk(id);
        if (caption != null) {
            item.caption = caption;
        }
        if (url != null) {
            item.url = url;
        }
        item.save();
        res.status(200).send(item)
    });


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    async (req: Request, res: Response) => {
        let { fileName } = req.params;
        const url = AWS.getPutSignedUrl(fileName);
        res.status(201).send({url: url});
    });

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url;

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        }

        // check Filename is valid
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        }

        const item = await new FeedItem({
            caption: caption,
            url: fileName
        });

        const saved_item = await item.save();

        saved_item.url = AWS.getGetSignedUrl(saved_item.url);
        res.status(201).send(saved_item);
    });

export const FeedRouter: Router = router;