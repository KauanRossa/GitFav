import { GithubUser } from "./GithubUser.js";

// classe que vai conter a logica como sera estruturados
export class favorites{
    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username){
        try{
            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists){
                throw new Error('Usuário já incluído!')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update();
            this.save();

        }catch(error){
            alert(error.message)
        }
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries;
        this.update();
        this.save();
    }
}

// classe que vai criar a visualização do HTML

export class FavoritesView extends favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update();
        this.onadd();
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update(){
        this.removeAlltr();

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositorios').textContent = user.public_repos
            row.querySelector('.seguidores').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar?')

                if (isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="" alt="">
                <a href="">
                    <p>
                        
                    </p>

                    <span>
                    
                    </span>
                </a>
            </td>
            <td class="repositorios">

            </td>
            <td class="seguidores">

            </td>
            <td>
                <span class="remove">Remover</span>
            </td>
        `

        return tr;
    }

    removeAlltr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();
        });
    }
}