import { CommandStore, KlasaMessage, util } from 'klasa';
import { Track } from 'lavalink';
import { Queue } from '../../lib/structures/music/Queue';
import { MusicCommand } from '../../lib/structures/MusicCommand';

export default class extends MusicCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: language => language.get('COMMAND_PLAY_DESCRIPTION'),
			music: ['USER_VOICE_CHANNEL'],
			usage: '(song:song)',
			flagSupport: true
		});

		this.createCustomResolver('song', (arg, possible, message) => arg ? this.client.arguments.get('song').run(arg, possible, message) : null);
	}

	// @ts-ignore
	public async run(message: KlasaMessage, [songs]: [Track | Track[]]) {
		const { music } = message.guild!;

		if (songs) {
			// If there are songs, add them
			await this.client.commands.get('add').run(message, [songs]);
			if (music.playing) return;
		} else if (!music.canPlay) {
			await message.sendLocale('COMMAND_QUEUE_EMPTY');
			return;
		}

		// If Aelia is not in a voice channel, join
		if (!music.voiceChannel) {
			await this.client.commands.get('join').run(message, []);
		}

		if (music.playing) {
			await message.sendLocale('COMMAND_PLAY_QUEUE_PLAYING');
		} else if (music.paused) {
			await music.resume();
			await message.sendLocale('COMMAND_PLAY_QUEUE_PAUSED', [music.song]);
		} else {
			music.channelID = message.channel.id;
			this.play(music).catch(error => this.client.emit('wtf', error));
		}
	}

	public async play(music: Queue): Promise<void> {
		while (music.length && music.channel) {
			const [song] = music;
			await music.channel.sendLocale('COMMAND_PLAY_NEXT', [song.title, await song.fetchRequester()]);
			await util.sleep(250);

			try {
				await music.play();
			} catch (error) {
				if (typeof error !== 'string') this.client.emit('error', error);
				if (music.channel) await music.channel.send(error);
				await music.leave();
				break;
			}
		}

		if (!music.length && music.channelID) {
			await music.channel!.sendLocale('COMMAND_PLAY_END');
			await music.leave().catch(error => {
				this.client.emit('wtf', error);
			});
		}
	}

}
